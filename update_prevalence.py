#!/usr/bin/env python3

import sys

if sys.version_info < (3, 6):
    sys.exit("This script requires Python 3.6 or later.")

import abc
import collections
import csv
from functools import reduce
import json
import re
import os
import shutil
from datetime import date, datetime, timedelta
from operator import attrgetter
from pathlib import Path
from typing import Optional, ClassVar, Iterator, List, Dict, Type, TypeVar, Any
from us_state_abbrev import us_state_name_by_abbrev

try:
    import pydantic
    import requests
except ImportError:
    print("Virtual environment not set up correctly.")
    print("Run:")
    print("  python3 -m venv .venv")
    print("  source .venv/bin/activate")
    print("  pip install pydantic requests")
    print("and then try running this script again.")
    print()
    sys.exit(1)

CAN_API_KEY = os.environ.get("CAN_API_KEY")

Model = TypeVar("Model", bound=pydantic.BaseModel)


def calc_effective_date() -> date:
    now = datetime.utcnow() - timedelta(days=1)
    # JHU daily reports are posted between 04:45 and 05:15 UTC the next day
    if now.hour < 6:
        now -= timedelta(days=1)
    return now.date()


effective_date = calc_effective_date()


# Read the Risk Tracker's vaccine table.
# Format:
# Type,0 dose,1 dose,2 dose
def import_vaccine_multipliers():
    vaccines = {}
    with open('./public/tracker/vaccine_table.csv', newline='') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            vaccine_name = row[0]
            if vaccine_name in ['No Vaccine', 'Unknown vaccine, unknown date']:
                continue
            if vaccine_name == 'Johnson & Johnson':
                vaccine_name = 'Janssen'  # JHU dataset uses 'Janssen' for this vaccine.
            vaccines[vaccine_name] = {
                'partial': float(row[2]),
                'complete': float(row[3]),
            }
    vaccines['Unknown'] = vaccines['AstraZenica']
    return vaccines

VACCINE_MULTIPLIERS = import_vaccine_multipliers()


# Johns Hopkins dataset


class JHUCommonFields(pydantic.BaseModel):
    FIPS: Optional[int]
    Admin2: Optional[str]
    Province_State: Optional[str]
    Country_Region: str
    Lat: float
    Long_: float
    Combined_Key: str


class JHUPlaceFacts(JHUCommonFields):
    SOURCE: ClassVar[
        str
    ] = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv"

    UID: int
    iso2: str
    iso3: str
    code3: int
    Population: int


class JHUDailyReport(JHUCommonFields):
    SOURCE: ClassVar[
        str
    ] = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/%m-%d-%Y.csv"

    # Last_Update: datetime, but not always in consistent format - we ignore
    Confirmed: int
    Deaths: int
    Recovered: int
    Active: int
    # Incident_Rate: float, was renamed from Incidence_Rate in early November
    # Case_Fatality_Ratio: float


class JHUCasesTimeseriesUS(JHUCommonFields):
    SOURCE: ClassVar[
        str
    ] = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"

    UID: int
    iso2: str
    iso3: str
    code3: int
    cumulative_cases: Dict[date, int] = {}


class JHUCasesTimeseriesGlobal(pydantic.BaseModel):
    SOURCE: ClassVar[
        str
    ] = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"

    Province_State: Optional[str]
    Country_Region: str
    Lat: float
    Long: float
    cumulative_cases: Dict[date, int] = {}

class JHUVaccinesHourlyUs(pydantic.BaseModel):
    SOURCE: ClassVar[
        str
    ] = "https://raw.githubusercontent.com/govex/COVID-19/master/data_tables/vaccine_data/us_data/hourly/vaccine_data_us.csv"

    FIPS: Optional[int]
    Province_State: Optional[str]
    Country_Region: Optional[str]
    Vaccine_Type: Optional[str]
    Doses_admin: Optional[int]  # raw numbers of doses
    Stage_One_Doses: Optional[int]
    Stage_Two_Doses: Optional[int]

class JHUVaccinesGlobal(pydantic.BaseModel):
    SOURCE: ClassVar[
        str
    ] = "https://raw.githubusercontent.com/govex/COVID-19/master/data_tables/vaccine_data/global_data/vaccine_data_global.csv"

    UID: Optional[int]
    Province_State: Optional[str]
    Country_Region: Optional[str]
    People_partially_vaccinated: Optional[int]  # raw number of people
    People_fully_vaccinated: Optional[int]


# Our World in Data dataset:


class OWIDTestingData(pydantic.BaseModel):
    # https://ourworldindata.org/coronavirus-testing#download-the-data
    SOURCE: ClassVar[
        str
    ] = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/testing/covid-testing-all-observations.csv"

    Entity: str
    Date: date
    ISO_code: str
    Source_URL: str
    Source_label: str
    Notes: str
    Daily_change_in_cumulative_total: int  # new tests today
    Cumulative_total: int
    Cumulative_total_per_thousand: float  # "per thousand" means population
    Daily_change_in_cumulative_total_per_thousand: float
    Seven_day_smoothed_daily_change: float  # 7-day moving average
    Seven_day_smoothed_daily_change_per_thousand: float
    Short_term_tests_per_case: Optional[float]  # appears to also be 7-day
    Short_term_positive_rate: Optional[float]


# CovidActNow dataset:


class CANMetrics(pydantic.BaseModel):
    testPositivityRatio: Optional[float]  # 7-day rolling average
    caseDensity: Optional[float]  # cases per 100k pop, 7-day rolling average

class CANActuals(pydantic.BaseModel):
    vaccinationsInitiated: Optional[int]  # Raw numbers of people vaccinated
    vaccinationsCompleted: Optional[int]

class CANRegionSummary(pydantic.BaseModel):
    # https://github.com/covid-projections/covid-data-model/blob/master/api/README.V1.md#RegionSummary
    COUNTY_SOURCE: ClassVar[
        str
    ] = f"https://api.covidactnow.org/v2/counties.json?apiKey={CAN_API_KEY}"
    STATE_SOURCE: ClassVar[
        str
    ] = f"https://api.covidactnow.org/v2/states.json?apiKey={CAN_API_KEY}"

    country: str
    fips: int
    lat: Optional[float]
    long_: Optional[float] = pydantic.Field(alias="long")
    state: str
    county: Optional[str]
    # lastUpdatedDate: datetime in nonstandard format, ignored for now
    # projections: ignored
    actuals: Optional[CANActuals]
    metrics: Optional[CANMetrics]
    population: int


# Romanian sub-national dataset:
class RomaniaPrevalenceData(pydantic.BaseModel):
    SOURCE: ClassVar[
        str
    ] = "https://covid19.geo-spatial.org/external/charts_vasile/assets/json/cazuri_zile_long.json"

    Date: date = pydantic.Field(alias="Data")
    County: str = pydantic.Field(alias="Judet")
    Population: int = pydantic.Field(alias="Populatie")
    TotalCases: int = pydantic.Field(alias="Cazuri total")


# Canada Public Health Region dataset:
class CanadaPHUFacts(pydantic.BaseModel):
    SOURCE: ClassVar[
        str
    ] = "https://raw.githubusercontent.com/ccodwg/Covid19Canada/master/other/hr_map_sk_new.csv"

    HR_UID: int
    province: str
    province_full: str
    health_region: str
    pop: Optional[int]


class CanadaPrevalenceData(pydantic.BaseModel):
    SOURCE: ClassVar[
        str
    ] = "https://raw.githubusercontent.com/ccodwg/Covid19Canada/master/timeseries_hr_sk_new/sk_new_cases_timeseries_hr_combined.csv"

    province: str
    health_region: str
    date_report: str # DD-MM-YYYY. Why ;_;
    cumulative_cases: int


class CanadaVaccinationData(pydantic.BaseModel):
    SOURCE: ClassVar[
        str
    ] = "https://raw.githubusercontent.com/ccodwg/Covid19Canada/master/timeseries_prov/vaccine_completion_timeseries_prov.csv"

    province: str
    #date_vaccine_completed: date
    cumulative_cvaccine: int


# Represents number of people vaccinated.
class Vaccination(pydantic.BaseModel):
    partial_vaccinations: int = 0
    completed_vaccinations: int = 0

# Our unified representation:
class Place(pydantic.BaseModel):
    fullname: str  # "San Francisco, California, US"
    name: str  # "San Francisco"
    population: int = 0  # 881549
    test_positivity_rate: Optional[float]  # 0.05
    cumulative_cases: Dict[date, int] = collections.Counter()

    # For some international data we don't get the positivity rate,
    # just the number of tests. We can approximate positivity rate
    # from that and the known number of cases.
    tests_in_past_week: Optional[int]

    vaccines_by_type: Optional[Dict[str, Vaccination]]
    vaccines_total = Vaccination()

    @property
    def recent_daily_cumulative_cases(self) -> List[int]:
        """Returns a list whose last entry is the most recent day's
        cumulative case count, and earlier entries are earlier days' counts.
        So recent_daily_cumulative_cases[-5] is the total number of cases reported
        up to 5 days ago.
        """
        daily_cumulative_cases = []
        current = effective_date
        if current not in self.cumulative_cases:
            raise ValueError(f"Missing data for {self.fullname} on {current:%Y-%m-%d}")
        while len(daily_cumulative_cases) < 14:
            prev = current - timedelta(days=1)
            if prev not in self.cumulative_cases:
                if prev > min(self.cumulative_cases.keys()):
                    # Gaps in the data shouldn't happen
                    raise ValueError(
                        f"Missing case count for {self.fullname} on {prev:%Y-%m-%d}"
                    )
                # But missing data at the beginning is normal -- counties
                # typically only show up when they have any cases.
                self.cumulative_cases[prev] = self.cumulative_cases[current]
            daily_cumulative_cases.append(
                self.cumulative_cases[current]
            )
            current = prev
        return daily_cumulative_cases[::-1]

    # Makes an estimate of the number of new cases in a slice of daily cumulative
    # cases. Nominally is values[-1] - values[0], but sometimes regions post
    # corrections which result in the number of cases decreasing.
    def cases_in_cum_cases(self, values) -> int:
        min_index = values.index(min(values))
        return max(values[min_index:]) - min(values)

    @property
    def cases_last_week(self) -> int:
        return self.cases_in_cum_cases(self.recent_daily_cumulative_cases[-7:])

    @property
    def cases_week_before(self) -> int:
        return self.cases_in_cum_cases(self.recent_daily_cumulative_cases[-14:-7])

    @property
    @abc.abstractmethod
    def app_key(self) -> str:
        ...

    def set_total_vaccines(self, partial_vaccinations: int, complete_vaccinations: int):
        self.vaccines_total.partial_vaccinations = partial_vaccinations
        self.vaccines_total.completed_vaccinations = complete_vaccinations
    
    def set_vaccines_of_type(self, vaccine_type: str, partial: int, complete: int):
        if self.vaccines_by_type is None:
            self.vaccines_by_type = {}
        
        self.vaccines_by_type[vaccine_type] = Vaccination()
        self.vaccines_by_type[vaccine_type].partial_vaccinations = partial
        self.vaccines_by_type[vaccine_type].completed_vaccinations = complete

    def completed_vaccination_total(self):
        if (self.vaccines_by_type is not None):
            return reduce(lambda x, key: x + self.vaccines_by_type[key].completed_vaccinations, self.vaccines_by_type, 0)
        return self.vaccines_total.completed_vaccinations

    def partial_vaccination_total(self):
        if (self.vaccines_by_type is not None):
            return reduce(lambda x, key: x + self.vaccines_by_type[key].partial_vaccinations, self.vaccines_by_type, 0)
        return self.vaccines_total.partial_vaccinations

    # Compute the estimated risk ratio for an unvaccinated person vs an average person.
    # Average prevalence = sum(prevalence in group * proportion of population in group)
    #                    = sum(vaccine_mult * unvaccinated_prev * proportion of population)
    # Unvaccinated risk / Average risk = sum(vaccine_mult * proportion of pop)
    #                                  = population / sum(vaccine_mult * proportion of pop)
    # Where the sum is taken over all vaccine types and status (incl no vaccine)
    def unvaccinated_relative_prevalence(self) -> float:
        total_vaccinated = 0
        risk_sum = 0

        if (self.vaccines_by_type is not None):
            for vaccine_type, vaccine_status in self.vaccines_by_type.items():
                total_vaccinated += vaccine_status.completed_vaccinations
                total_vaccinated += vaccine_status.partial_vaccinations
                risk_sum += VACCINE_MULTIPLIERS[vaccine_type]['complete'] * vaccine_status.completed_vaccinations
                risk_sum += VACCINE_MULTIPLIERS[vaccine_type]['partial'] * vaccine_status.partial_vaccinations
        else:
            risk_sum = (
                VACCINE_MULTIPLIERS['Unknown']['complete'] * 
                self.vaccines_total.completed_vaccinations +
                VACCINE_MULTIPLIERS['Unknown']['partial'] * 
                self.vaccines_total.partial_vaccinations
            )
            total_vaccinated = (
                self.vaccines_total.completed_vaccinations + 
                self.vaccines_total.partial_vaccinations
            )

        if total_vaccinated == 0:
            return 

        if total_vaccinated >= self.population:
            # This probably means people from other counties have gotten their
            # vaccine here. Just assume 100% vaccination.
            return total_vaccinated / risk_sum
         
        total_unvaccinated = self.population - total_vaccinated
        risk_sum += 1 * total_unvaccinated
        return float(self.population) / risk_sum


    # Computes the average vaccine multiplier of the region. For use in computing
    # "Average vaccinated" person
    def average_fully_vaccinated_multiplier(self) -> float:
        if (self.vaccines_by_type is None):
            return VACCINE_MULTIPLIERS['Unknown']['complete']

        vaccine_multiplier = 0
        total_fully_vaccinated = 0
        for vaccine_type, vaccine_status in self.vaccines_by_type.items():
            total_fully_vaccinated += vaccine_status.completed_vaccinations
            vaccine_multiplier += vaccine_status.completed_vaccinations * VACCINE_MULTIPLIERS[vaccine_type]['complete']

        if total_fully_vaccinated == 0:
            return VACCINE_MULTIPLIERS['Unknown']['complete']     
        return vaccine_multiplier / total_fully_vaccinated

    
    def as_app_data(self) -> "AppLocation":
        last_week = self.cases_last_week
        week_before = self.cases_week_before
        if last_week <= week_before or week_before <= 0:
            increase = 0
        else:
            increase = last_week / week_before - 1

        if (self.population <= 0 and self.name != "Unknown"):
            raise ValueError(f'Population for {self.name} is {self.population}')

        if (self.cases_last_week < 0):
            raise ValueError(f'Cases for {self.name} is {self.cases_last_week}')

        return AppLocation(
            label=self.name,
            population=f"{self.population:,}",
            casesPastWeek=self.cases_last_week,
            casesIncreasingPercentage=increase * 100,
            positiveCasePercentage=(
                self.test_positivity_rate * 100
                if self.test_positivity_rate is not None
                else None
            ),
            incompleteVaccinations=self.partial_vaccination_total() or None,
            completeVaccinations=self.completed_vaccination_total() or None,
            unvaccinatedPrevalenceRatio=self.unvaccinated_relative_prevalence(),
            averageFullyVaccinatedMultiplier=self.average_fully_vaccinated_multiplier(),
        )


class County(Place):
    country: str
    state: str
    fips: Optional[str]  # US only: 5-digit code

    @property
    def app_key(self) -> str:
        if self.fips is not None:
            return f"US_{self.fips.rjust(5, '0')}"
        else:
            slug = "_".join([self.country, self.state, self.name])
            return re.sub(r"[^A-Za-z0-9_]", "_", slug)


class State(Place):
    country: str
    fips: Optional[str]  # US only: 2-digit code
    counties: Dict[str, County] = {}

    @property
    def app_key(self) -> str:
        if self.fips is not None:
            return f"US_{self.fips.rjust(2, '0')}"
        else:
            slug = "_".join([self.country, self.name])
            return re.sub(r"[^A-Za-z0-9_]", "_", slug)

    def as_app_data(self) -> "AppLocation":
        result = super().as_app_data()
        if self.country == "US":
            result.topLevelGroup = "US states"
            result.subdivisions = [county.app_key for county in self.counties.values()]
        if self.country == "Canada":
            # actually provinces, but reflecting that might break the spreadsheet.
            result.topLevelGroup = "Canada states"
            result.subdivisions = [county.app_key for county in self.counties.values()]
        return result


class Country(Place):
    iso3: Optional[str]  # USA
    states: Dict[str, State] = {}

    @property
    def app_key(self) -> str:
        return re.sub(r"[^A-Za-z0-9_]", "_", self.name)

    def as_app_data(self) -> "AppLocation":
        result = super().as_app_data()
        result.topLevelGroup = "Countries"
        if self.name == "US":
            result.label = "United States (all)"
        else:
            result.subdivisions = [
                state.app_key
                for state in self.states.values()
                if state.name != "Unknown"
            ]
        result.iso3 = self.iso3
        return result


class AppLocation(pydantic.BaseModel):
    label: str
    iso3: Optional[str]
    population: str
    casesPastWeek: int
    casesIncreasingPercentage: float
    positiveCasePercentage: Optional[float]
    topLevelGroup: Optional[str] = None
    subdivisions: List[str] = []
    incompleteVaccinations: Optional[int]
    completeVaccinations: Optional[int]
    unvaccinatedPrevalenceRatio: Optional[float]
    averageFullyVaccinatedMultiplier: float

    # https://covid19-projections.com/estimating-true-infections-revisited/
    def prevalanceRatio(self) -> float:
        DAY_0 = datetime(2020, 2, 12)
        day_i = (datetime.now() - DAY_0).days
        positivityRate = self.positiveCasePercentage
        if positivityRate is None or positivityRate > 100:
            positivityRate = 100
        final = (1000 / (day_i + 10)) * (positivityRate / 100) ** 0.5 + 2
        return final

    def as_csv_data(self) -> Dict[str, str]:
        population = int(self.population.replace(",", ""))
        reported = (self.casesPastWeek + 1) / population
        underreporting = self.prevalanceRatio()
        delay = min(1.0 + (self.casesIncreasingPercentage / 100), 2.0)
        estimated_prevalence = reported * underreporting * delay
        return {
            "Name": self.label,
            "Population": str(population),
            "Cases in past week": str(self.casesPastWeek),
            "Reported prevalence": str(round(reported, 6)),
            "Underreporting factor": str(round(underreporting, 4)),
            "Delay factor": str(round(delay, 4)),
            "Estimated prevalence": str(round(estimated_prevalence, 6)),
            # TODO: Figure out how to add vaccine data to export without breaking existing sheets.
            # "Estimated unvaccinated prevalence": (
            #     str(round(self.unvaccinatedPrevalenceRatio * estimated_prevalence, 6))
            #     if self.unvaccinatedPrevalenceRatio is not None
            #     else "Unknown"
            # ),
            # "Estimated vaccinated prevalence": (
            #     str(round(self.unvaccinatedPrevalenceRatio * estimated_prevalence * self.averageFullyVaccinatedMultiplier, 6))
            #     if self.unvaccinatedPrevalenceRatio is not None
            #     else "Unknown"
            # )
        }

class AppLocations(pydantic.BaseModel):
    __root__: Dict[str, AppLocation]


class AllData:
    def __init__(self) -> None:
        self.countries: Dict[str, Country] = {}
        self.fips_to_county: Dict[int, County] = {}
        self.uid_to_place: Dict[int, Place] = {}


    def get_country(self, name: str) -> Country:
        if name not in self.countries:
            self.countries[name] = Country(name=name, fullname=name)
        return self.countries[name]

    def get_state(self, name: str, *, country: str) -> State:
        parent = self.get_country(country)
        if name not in parent.states:
            parent.states[name] = State(
                name=name, fullname=f"{name}, {country}", country=country
            )
        return parent.states[name]

    def get_state_or_raise(self, name: str, country: str) -> State:
        return self.countries[country].states[name]

    def get_county(self, name: str, *, state: str, country: str) -> County:
        parent = self.get_state(state, country=country)
        if name not in parent.counties:
            parent.counties[name] = County(
                name=name,
                fullname=f"{name}, {state}, {country}",
                state=state,
                country=country,
            )
        return parent.counties[name]

    def get_jhu_place(self, jhu_line: JHUCommonFields) -> Place:
        if jhu_line.Admin2:
            return self.get_county(
                jhu_line.Admin2,
                state=jhu_line.Province_State,
                country=jhu_line.Country_Region,
            )
        elif jhu_line.Province_State:
            return self.get_state(
                jhu_line.Province_State,
                country=jhu_line.Country_Region,
            )
        elif jhu_line.Country_Region == "Korea, South":
            return self.get_country("South Korea")
        else:
            return self.get_country(jhu_line.Country_Region)

    def get_canada_phu_place(self, line: CanadaPHUFacts) -> Place:
        return self.get_county(
                line.health_region,
                state=line.province_full,
                country="Canada")

    def populate_fips_cache(self) -> None:
        self.fips_to_county.clear()
        for country in self.countries.values():
            for state in country.states.values():
                for county in state.counties.values():
                    if county.fips is not None:
                        fips = int(county.fips)
                        if fips in self.fips_to_county:
                            raise ValueError(
                                f"FIPS code {fips} refers to both "
                                f"{self.fips_to_county[fips]!r} and "
                                f"{county!r}"
                            )
                        self.fips_to_county[fips] = county

    def add_place_to_uid_cache(self, uid: int, place: Place):
        self.uid_to_place[uid] = place

    # Attempt to set the population, cases, and postitive test rates of a region
    # based on the stats of all its sub-regions
    def rollup_totals(self) -> None:
        fake_names = ("Unknown", "Unassigned", "Recovered")

        def rollup_population(parent: Place, child_attr: str) -> None:
            children: Dict[str, Place] = getattr(parent, child_attr)

            if parent.population == 0:
                for child in children.values():
                    parent.population += child.population
                if not parent.population and parent.name not in fake_names:
                    raise ValueError(f"Missing population data for {parent!r}")

        def rollup_cases(parent: Place, child_attr: str) -> None:
            children: Dict[str, Place] = getattr(parent, child_attr)

            if not parent.cumulative_cases:
                for child in children.values():
                    parent.cumulative_cases += child.cumulative_cases
                if not parent.cumulative_cases:
                    return False
            if parent.population == 0:  # fake region (Unknown, etc)
                try:
                    cases_last_week = parent.cases_last_week
                except ValueError:
                    cases_last_week = 0
                if not cases_last_week:
                    return False
            return True

        def rollup_testing(parent: Place, child_attr: str) -> None:
            children: Dict[str, Place] = getattr(parent, child_attr)

            if parent.test_positivity_rate is None:
                if parent.tests_in_past_week:
                    parent.test_positivity_rate = (
                        parent.cases_last_week / parent.tests_in_past_week
                    )

                tests_last_week = 0
                valid = bool(children)
                for child in children.values():
                    if child.test_positivity_rate is None:
                        valid = False
                    elif child.test_positivity_rate > 0:
                        tests_last_week += (
                            child.cases_last_week / child.test_positivity_rate
                        )
                if valid and tests_last_week:
                    parent.test_positivity_rate = (
                        parent.cases_last_week / tests_last_week
                    )

        def rolldown_vaccine_types(parent: Place,  children: List[Place]):
            for child in children:
                if (child.vaccines_by_type is None):
                    child_vaccinations = child.vaccines_total
                    # Assume that sub-places have the same ratio of vaccine types
                    completed_vaccination_total = parent.completed_vaccination_total()
                    partial_vaccination_total = parent.partial_vaccination_total()
                    for vaccine_type, parent_vaccinations in parent.vaccines_by_type.items():
                        child_partials = parent_vaccinations.partial_vaccinations * child_vaccinations.partial_vaccinations / partial_vaccination_total
                        child_completes = parent_vaccinations.completed_vaccinations * child_vaccinations.completed_vaccinations / completed_vaccination_total
                        child.set_vaccines_of_type(vaccine_type, child_partials, child_completes)

        for country in self.countries.values():
            for state in country.states.values():
                if state.vaccines_by_type is not None:
                    rolldown_vaccine_types(state, state.counties.values())
                for county in state.counties.values():
                    if county.population == 0 and county.name not in fake_names:
                        raise ValueError(f"Missing population data for {county!r}")
                rollup_population(state, "counties")
            rollup_population(country, "states")

        for country in list(self.countries.values()):
            for state in list(country.states.values()):
                for county in list(state.counties.values()):
                    if not county.cumulative_cases:
                        if (
                            county.fullname
                            in (
                                # These just don't have any reported cases
                                "Hoonah-Angoon, Alaska, US",
                                "Lake and Peninsula, Alaska, US",
                                "Skagway, Alaska, US",
                                "Unassigned, District of Columbia, US",
                                "Kalawao, Hawaii, US",
                                # These are reported under a combined name
                                "Dukes, Massachusetts, US",
                                "Nantucket, Massachusetts, US",
                                "Bronx, New York, US",
                                "Kings, New York, US",
                                "Queens, New York, US",
                                "Richmond, New York, US",
                                # Utah reports by region, not county
                            )
                            or county.state == "Utah"
                        ):
                            pass  # don't warn
                        else:
                            print(f"Discarding {county!r} with no case data")
                        del state.counties[county.name]

                    if county.test_positivity_rate is None:
                        if county.tests_in_past_week:
                            county.test_positivity_rate = (
                                county.cases_last_week / county.tests_in_past_week
                            )
                        elif state.test_positivity_rate is not None:
                            # Some US counties don't have data; fall back to
                            # assuming they're average for their state.
                            county.test_positivity_rate = state.test_positivity_rate


                if not rollup_cases(state, "counties"):
                    if state.country == "Nigeria":
                        pass  # Nigeria only reports nation-level cases
                    elif state.name in ("American Samoa", "Unknown", "Recovered"):
                        pass
                    else:
                        print(f"Discarding {state!r} with no case data")
                    del country.states[state.name]

                for county in list(state.counties.values()):
                    if county.name in fake_names:
                        # Now that we've incorporated these unassigned/etc
                        # cases into the state totals, we have no further need
                        # of the county-level data.
                        del state.counties[county.name]

                if state.test_positivity_rate is None:
                    if state.counties or state.tests_in_past_week:
                        rollup_testing(state, "counties")
                    elif country.test_positivity_rate is not None:
                        state.test_positivity_rate = country.test_positivity_rate

            if not rollup_cases(country, "states"):
                raise ValueError(f"Missing case data for {country!r}")
            rollup_testing(country, "states")


class DataCache(pydantic.BaseModel):
    effective_date: date
    data: Dict[str, str] = {}

    @classmethod
    def load(cls) -> "DataCache":
        try:
            result = cls.parse_file(".prevalence_data.json")
        except OSError:
            pass
        except Exception as exc:
            print(f"discarding corrupted cache: {exc!r}")
            os.unlink(".prevalence_data.json")
        else:
            if result.effective_date == effective_date:
                return result
        return cls(effective_date=effective_date)

    def save(self) -> None:
        with open(".prevalence_data.json", "w") as fp:
            fp.write(self.json())

    def get(self, url: str) -> str:
        try:
            return self.data[url]
        except KeyError:
            pass
        self.data[url] = requests.get(url).text
        return self.data[url]


def parse_csv(cache: DataCache, model: Type[Model], url: str) -> List[Model]:
    print(f"Fetching {url}...", end=" ", flush=True)
    lines = cache.get(url).splitlines()
    reader = csv.reader(lines)
    fields = [
        re.sub("^7", "Seven", re.sub("[^A-Za-z0-9_]", "_", name))
        for name in next(reader)
    ]

    result = []
    for line in reader:
        kw: Dict[str, Optional[str]] = {}
        for field, val in zip(fields, line):
            info = model.__fields__.get(field)
            if info is None:
                continue
            if val == "":
                if not info.required:
                    kw[field] = None
                elif info.type_ in (int, float):
                    kw[field] = "0"
                else:
                    kw[field] = ""
            elif val.endswith(".0") and val[:-2].isdigit():
                kw[field] = val[:-2]
            elif info.type_ is int and "e+" in val:
                kw[field] = int(float(val))
            else:
                kw[field] = val
        result.append(model(**kw))

    print(f"read {len(lines)} objects")
    return result


def parse_json(cache: DataCache, model: Type[Model], url: str) -> List[Model]:
    print(f"Fetching {url}...", end=" ", flush=True)
    result = pydantic.parse_obj_as(List[model], json.loads(cache.get(url)))
    print(f"read {len(result)} objects")
    return result


def ignore_jhu_place(line: JHUCommonFields) -> bool:
    if line.Combined_Key == "":
        return True
    if line.Province_State in (
        "Diamond Princess",
        "Grand Princess",
        "Port Quarantine",
        "US Military",
        "Federal Bureau of Prisons",
        "Veteran Hospitals",
        "Repatriated Travellers",
        "Summer Olympics 2020",
    ):
        return True
    if line.Country_Region in (
        "Diamond Princess",
        "Grand Princess",
        "MS Zaandam",
        "Western Sahara",
        "Micronesia",
        "Palau",
        "Summer Olympics 2020",
    ):
        return True
    if line.Country_Region == "US":
        if line.Province_State == "Recovered":
            return True
        if line.Admin2 and line.Admin2.startswith("Out of "):
            return True
        if line.Admin2 in (
            "Federal Correctional Institution (FCI)",
            "Michigan Department of Corrections (MDOC)",
        ):
            return True
    return False


def main() -> None:
    if not CAN_API_KEY:
        print("Usage: CAN_API_KEY=${COVID_ACT_NOW_API_KEY} python3 %s" % sys.argv[0])
        sys.exit(1)
    cache = DataCache.load()
    try:
        data = AllData()
        country_by_iso3: Dict[str, Country] = {}

        # List of regions and their population
        for line in parse_csv(cache, JHUPlaceFacts, JHUPlaceFacts.SOURCE):
            if ignore_jhu_place(line):
                continue
            if {line.Country_Region, line.Province_State} & {"Unknown", "Unassigned"}:
                # These mark cases not attached to a more specific region.
                # We want to count their cases, but they don't have population.
                continue
            if (
                line.Province_State == "Alaska"
                and line.Admin2 == "Bristol Bay plus Lake Peninsula"
            ):
                # These are strangely combined; Lake and Peninsula already
                # has its own entry so turn the combo into just Bristol Bay
                line.Admin2 = "Bristol Bay"
                line.Population = 877  # from Google
            if (
                line.Province_State == "Alaska"
                and line.Admin2 == "Yakutat plus Hoonah-Angoon"
            ):
                # These are strangely combined; Lake and Peninsula already
                # has its own entry so turn the combo into just Bristol Bay
                line.Admin2 = "Yakutat"
                line.Population = 604  # from Google
            if (
                line.Country_Region == "Korea, South"
            ):
                line.Country_Region = "South Korea"
            place = data.get_jhu_place(line)
            data.add_place_to_uid_cache(line.UID, place)
            if place.population != 0:
                raise ValueError(
                    f"Duplicate population info for {place!r}: {line.Population}"
                )
            if isinstance(place, Country):
                place.iso3 = line.iso3
                country_by_iso3[line.iso3] = place
            place.population = line.Population
            if isinstance(place, (County, State)) and line.FIPS is not None:
                place.fips = str(line.FIPS)
        data.populate_fips_cache()

        # Cumulative cases per region
        populate_since = effective_date - timedelta(days=15)
        current = effective_date
        while current >= populate_since:
            for line in parse_csv(
                cache, JHUDailyReport, current.strftime(JHUDailyReport.SOURCE)
            ):
                if ignore_jhu_place(line):
                    continue
                place = data.get_jhu_place(line)
                if place.population == 0 and place.name not in (
                    "Unassigned",
                    "Unknown",
                ):
                    raise ValueError(
                        f"JHU data has cases but no population for {place!r} with line data: {line!r}"
                    )
                place.cumulative_cases[current] = line.Confirmed
            current -= timedelta(days=1)

        # Global vaccination rates
        for item in parse_csv(cache, JHUVaccinesGlobal, JHUVaccinesGlobal.SOURCE):
            if item.UID is None or item.People_partially_vaccinated is None:
                continue
            try:
                place = data.uid_to_place[item.UID]
                place.set_total_vaccines(item.People_partially_vaccinated - item.People_fully_vaccinated, item.People_fully_vaccinated)
            except KeyError:
                print(f"Could not find UID {item.UID}")

        # US vaccination rates
        for item in parse_csv(cache, JHUVaccinesHourlyUs, JHUVaccinesHourlyUs.SOURCE):
            try:
                state = data.get_state_or_raise(name=item.Province_State, country=item.Country_Region)
                if item.Vaccine_Type == "All":
                    state.set_total_vaccines(item.Stage_One_Doses, item.Stage_Two_Doses)
                elif item.Vaccine_Type in ['Pfizer', 'Moderna']:
                    # If listed, Stage_One_Doses appears to include people with second doses.
                    partially_vaccinated = (
                        item.Stage_One_Doses - item.Stage_Two_Doses
                        if item.Stage_One_Doses is not None
                        else item.Doses_admin - item.Stage_Two_Doses * 2
                    )
                    state.set_vaccines_of_type(item.Vaccine_Type, partially_vaccinated, item.Stage_Two_Doses)
                elif item.Vaccine_Type == 'Janssen':
                    state.set_vaccines_of_type(item.Vaccine_Type, 0, item.Stage_One_Doses)
            except KeyError:
                continue
                # Suppressed debug info - includes things like DoD, VHA, etc.
                # print(f"Could not find state {item.Province_State}")

        # Test positivity and vaccination status per US county and state
        for item in parse_json(cache, CANRegionSummary, CANRegionSummary.COUNTY_SOURCE):
            assert (
                type(item.fips) is int
            ), "Expected item.fips to be int but got {}".format(type(item.fips))
            if item.fips not in data.fips_to_county:
                # Ignore e.g. Northern Mariana Islands
                print(f"ignoring unknown county fips {item.fips}")
                continue
            county = data.fips_to_county[item.fips]
            assert (
                us_state_name_by_abbrev[item.state] == county.state
            ), f"expected {item.state} to be {county.state}"
            if item.metrics is not None:
                county.test_positivity_rate = item.metrics.testPositivityRatio
            if item.actuals is not None and item.actuals.vaccinationsCompleted is not None:
                completed_vaccinations= item.actuals.vaccinationsCompleted
                partial_vaccinations = item.actuals.vaccinationsInitiated - completed_vaccinations
                county.set_total_vaccines(partial_vaccinations, completed_vaccinations)

        for item in parse_json(cache, CANRegionSummary, CANRegionSummary.STATE_SOURCE):
            state_name = us_state_name_by_abbrev[item.state]
            state = data.countries["US"].states[state_name]
            if item.metrics is not None:
                state.test_positivity_rate = item.metrics.testPositivityRatio

        # Test positivity per non-US country
        for line in parse_csv(cache, OWIDTestingData, OWIDTestingData.SOURCE):
            # These are in sorted order so we'll keep overwriting with
            # more recent data per country
            country = country_by_iso3.get(line.ISO_code)
            if country is not None:
                if line.Short_term_positive_rate is not None:
                    country.test_positivity_rate = line.Short_term_positive_rate
                elif line.Seven_day_smoothed_daily_change:
                    country.tests_in_past_week = (
                        line.Seven_day_smoothed_daily_change * 7
                    )

        # Romanian county (judet) data. Treat as states internally.
        for line in parse_json(cache, RomaniaPrevalenceData, RomaniaPrevalenceData.SOURCE):
            state = data.get_state(line.County, country="Romania")
            state.population = line.Population
            state.cumulative_cases[line.Date] = line.TotalCases

        # Add Canada Public Health Unit (county-level) population data
        for line in parse_csv(cache, CanadaPHUFacts, CanadaPHUFacts.SOURCE):
            if (line.HR_UID == 9999): # Repatriated/not reported. Skip.
                continue
            place = data.get_canada_phu_place(line)
            if place.population != 0:
                raise ValueError(
                    f"Duplicate population info for {place!r}: {line.Population}"
                )
            place.population = line.pop

        def get_full_canadian_province(short_province_name):
            if (short_province_name == "BC"):
                return "British Columbia"
            elif (short_province_name == "NL"):
                return "Newfoundland and Labrador"
            elif (short_province_name == "NWT"):
                return "Northwest Territories"
            elif (short_province_name == "PEI"):
                return "Prince Edward Island"
            return short_province_name

        # Add Canada Public Health Unit (county-level) cumulative cases data
        for line in parse_csv(cache, CanadaPrevalenceData, CanadaPrevalenceData.SOURCE):
            if line.health_region == "Not Reported" or line.province == line.health_region:
                continue
            province_full = get_full_canadian_province(line.province)
            place = data.get_county(line.health_region, state=province_full, country="Canada")
            processed_date = datetime.strptime(line.date_report, "%d-%m-%Y").date()
            if (processed_date >= populate_since):
                place.cumulative_cases[processed_date] = line.cumulative_cases

        # Add Canada provincial vaccination data
        for line in parse_csv(cache, CanadaVaccinationData, CanadaVaccinationData.SOURCE):
            province_full = get_full_canadian_province(line.province)
            place = data.get_state(province_full, country="Canada")
            # assuming ascending date order (oldest to newest)
            place.set_total_vaccines(0, line.cumulative_cvaccine)

    finally:
        cache.save()

    data.rollup_totals()

    app_locations: Dict[str, AppLocation] = {}
    namegetter = attrgetter("name")

    # US states first so they float to the top of the list
    for state in sorted(data.countries["US"].states.values(), key=namegetter):
        if state.fips is not None and int(state.fips) < 60:  # real states
            app_locations[state.app_key] = state.as_app_data()

    for state in sorted(data.countries["US"].states.values(), key=namegetter):
        if state.app_key not in app_locations:  # then territories etc
            app_locations[state.app_key] = state.as_app_data()

    # Then everything else
    for country in sorted(data.countries.values(), key=namegetter):
        app_locations[country.app_key] = country.as_app_data()
        for state in country.states.values():
            if state.app_key not in app_locations:
                app_locations[state.app_key] = state.as_app_data()
            for county in state.counties.values():
                app_locations[county.app_key] = county.as_app_data()

    # Format the result
    to_insert: List[str] = []

    def format_obj(obj: Dict[str, Any], indent: str = "  ") -> None:
        for key, value in obj.items():
            if isinstance(value, dict):
                to_insert.append(indent + key + ": {\n")
                format_obj(value, indent + "  ")
                to_insert.append(indent + "},\n")
            elif isinstance(value, list) and len(value) > 5:
                to_insert.append(indent + key + ": [\n")
                for elem in value:
                    to_insert.append(f"{indent}  {elem!r},\n")
                to_insert.append(indent + "],\n")
            elif value is None:
                to_insert.append(f"{indent}{key}: null,\n")
            else:
                to_insert.append(f"{indent}{key}: {value!r},\n")

    format_obj(json.loads(AppLocations(__root__=app_locations).json()))

    # And use it to update the app code
    locations_path = "src/data/location.ts"
    with open(locations_path) as fp:
        lines = fp.readlines()

    output: List[str] = []
    skipping = False
    missing_markers = {"locations", "date"}
    for line in lines:
        if "// update_prevalence locations end" in line:
            assert skipping
            skipping = False
        if "// update_prevalence date" in line:
            output.append(
                "export const PrevalenceDataDate = '{}' // update_prevalence date\n".format(
                    effective_date.strftime("%B %d, %Y")
                )
            )
            missing_markers.remove("date")
            continue
        if not skipping:
            output.append(line)
        if "// update_prevalence locations start" in line:
            missing_markers.remove("locations")
            skipping = True
            output.extend(to_insert)

    if missing_markers:
        sys.exit(
            f"{locations_path} does not contain markers {list(missing_markers)}; "
            f"can't update"
        )

    with open(locations_path, "w") as fp:
        fp.writelines(output)

    # Also write CSVs containing the data, for the spreadsheet to import.
    csvdir = Path("public/prevalence_data")
    if csvdir.exists():
        shutil.rmtree(csvdir)
    csvdir.mkdir()
    (csvdir / "date.csv").write_text(
        "Date\n{}".format(effective_date.strftime("%Y-%m-%d"))
    )
    with (csvdir / "index.csv").open("w") as topfile:
        topfile.write("Location,Slug\n")
        for slug, data in app_locations.items():
            if not data.topLevelGroup:
                continue

            topfile.write(f"{data.label},{slug}\n")
            with (csvdir / slug).with_suffix(".csv").open("w") as subfile:
                top_row = data.as_csv_data()
                subfile.write(",".join(top_row.keys()) + "\n")
                if "states" in data.topLevelGroup.lower():
                    top_row["Name"] = "Entire state"
                else:
                    top_row["Name"] = "Entire country"
                subfile.write(",".join(top_row.values()) + "\n")

                for subkey in data.subdivisions:
                    subfile.write(
                        ",".join(app_locations[subkey].as_csv_data().values()) + "\n"
                    )


if __name__ == "__main__":
    main()
