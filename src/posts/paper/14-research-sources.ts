import ferrettiFig2 from './img/ferretti-infectiousness.gif'
import heExtended from './img/he-extended-fig-1.png'
import infectiousDecayModel from './img/infectious_decay_model.png'
import mcaloonIncubationPeriod from './img/mcaloon_incubation_period.png'
import positiveTestRate from './img/positive-test-rate.png'

const title = 'Research Sources'
const shortTitle = title
const content = `

Read this section if you are interested in the epistemic nitty-gritty behind our estimates of Activity Risk and Person Risk.

## Activity Risk

### Indoor unmasked transmission

#### One-time contact

This is the chance that you would get COVID from spending more than 10 minutes indoors or in close proximity to someone who is COVID-positive. We estimate this as “about 6% per hour” from combining multiple sources:

1. In a study of train passengers that analyzed 2,334 index patients with COVID, [Hu et al.](https://academic.oup.com/cid/advance-article/doi/10.1093/cid/ciaa1057/5877944) found that passengers on seats within the same row as the index patient had an average attack rate of 1.5%; for passengers in adjacent seats, the attack rate increased 1.3% per hour. Assuming train passengers are mostly silent, combining this with the respiration rates from the [Jimenez Aerosol Transmission Model](https://docs.google.com/spreadsheets/d/16K1OQkLD4BjgBdO8ePj6ytf-RpPMlJ6aXFg3PrIQBbQ/edit#gid=519189277) would imply that a conversational hangout in the adjacent seat of a train would be a risk of **roughly 6% per hour**. The distance between adjacent seats on this train was half a meter, and we think typical socialization is moderately further away than this, which gives some extra breathing room on the estimate.
2. Using the [Jimenez Aerosol Transmission Model](https://docs.google.com/spreadsheets/d/16K1OQkLD4BjgBdO8ePj6ytf-RpPMlJ6aXFg3PrIQBbQ/edit#gid=519189277), we modify the “Class” scenario (1 infected instructor speaking loudly) to propose a normal conversational volume, smaller room (10ft wide x 14ft long x 10ft high), and no masks, leaving other parameters unchanged. This outputs 2.8% per hour; however, this model notes it assumes uniform mixing of air and ignores near-field effects, so is not a good estimate for interactions that aren’t 6+ feet. If we take this as our 6+ feet estimate, and double it as per the “Distance” modifiers described later, this also **suggests 6% per hour**. (Note that this is rather dependent on room size: increasing the 10ft width to 15ft decreases the estimate by a third.)
3. [Bi et al](https://www.thelancet.com/action/showPdf?pii=S1473-3099%2820%2930287-5) analyzed Shenzhen contact tracing data from Jan 14–Feb 12 (1281 contacts of 291 cases). Their Table 3 provides data about how often close contacts of COVID-positive people got infected based on different types of contact. The average estimates for each group tend to fall **roughly between 6-9%** (total, not per hour); we note that the vast majority of the infections in this dataset come from the “Contact frequency: Often” category, so we expect this to be an overestimate for the “Moderate” and “Rare” frequency. This data was collected in a setting where 17% of cases were isolated _before_ symptom onset, and we would expect a larger fraction isolated after symptom onset, so the numbers would be higher in a setting where people are not being notified when their contacts get sick.
4. Next is [Chu et al](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)31142-9/fulltext) who did a meta-analysis of 172 studies covering 26,000 individuals, to determine the impact of various interventions (masks, distance, and eye protection) on transmissibility. Importantly to note, they included analyses of SARS and MERS, not just COVID-19. As shown in their Table 2, they found baseline transmissibility values (without masks/distance/etc) of 12.8%, 17.4%, and 16% in different groups. These data mostly come from healthcare settings, and the baseline assumption is direct physical contact, rather than an ordinary socializing distance. We don’t know how many hours were generally spent with patients. We assume these are infected patients who have sought treatment, so definitionally there is no additional distance from anyone symptomatic, so we might expect casual social contact outside a healthcare setting to carry a lower infection probability. However, COVID-19 may be [more infectious/contagious](https://www.medicalnewstoday.com/articles/how-do-sars-and-mers-compare-with-covid-19#Coronaviruses-past-and-present) than SARS and MERS. Overall, this is consistent with “6% per hour” for normal socializing if the average duration in this dataset is on the order of 2 hours; if the baseline “no distance” is closer together than typical socializing; or some combination.
5. In a prospective study in Taiwan, [Cheng et al](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2765641) found a secondary attack rate of 1.0% among contacts of longer than 15 minutes who were exposed within the first 5 days of symptom onset. This **implies a rate of 4% per hour** if all the contacts were only 15 minutes (and even lower rates if the contacts were for longer).

#### Household member

This is the chance of getting infected from a household member who has COVID. We use the estimate of 30% from the meta-analysis of [Curmei et al.](https://www.medrxiv.org/content/10.1101/2020.05.23.20111559v2) (specifically their updated June 27 version). We explain a bit here about where their estimate comes from.

[Curmei et al.](https://www.medrxiv.org/content/10.1101/2020.05.23.20111559v2) used three different methods to synthesize existing literature. The first method is a re-analysis of nine recent studies, which gives them the central estimate of 30% for the “secondary attack rate” (which is the parameter we care about: the chance of getting infected from a housemate who has COVID). They point out that the estimates vary substantially from source to source, which they conjecture is likely in part due to variations in isolation practices.

Their other two estimation methods use independent datasets. Although these two methods don’t estimate secondary attack rate—rather, they estimate R<sub>h</sub>, the _number_ of within-household transmissions, which is not quite the number we’re looking for—we can nonetheless use this information as corroboration. Specifically, they estimate an R<sub>h </sub>of 0.37 from Vo’, Italy, where average household size was 2.1. If the average infected person infects 0.37 of their 1.1 (excluding self) other household members, that works out to each household member having a 34% risk of being infected. The data suggests this could be substantially larger for older people.

#### Partner

This is a highly speculative number. [Li et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7184465/) found a 1.6x higher infection rate among spouses than among other adult household members. This is just one datapoint, but it’s the best we have right now. We use this to adjust the 30% figure from [Curmei et al.](https://www.medrxiv.org/content/10.1101/2020.05.23.20111559v2) up by 1.6x, to get 48% for spouses.


### Modifiers to Activity Risk: Masked, Outdoors/Ventilation, Distanced

#### Masks

_Note: we updated our mask categories and numbers in late January of 2021._

We divide our analysis into protecting others (source control) and protecting the wearer (PPE). We draw the majority of our sources from the [Howard et al.](https://www.preprints.org/manuscript/202004.0203/v4) Evidence Review (version 4 from Oct 2020), which surveys a variety of study types, some COVID-specific, and some studying particle filtration as a property of the fabric, or for other pathogens such as influenza.


##### Masks: Protecting others
For protecting others (i.e. source control), we draw on the following sources, three of which are new in this revision of our estimates:
* [Davies et al.](https://www.researchgate.net/publication/258525804_Testing_the_Efficacy_of_Homemade_Masks_Would_They_Protect_in_an_Influenza_Pandemic): percent filtration of influenza microorganisms isolated from coughs, and total reduction in colony-forming units.
* [Milton et al.](https://journals.plos.org/plospathogens/article?id=10.1371/journal.ppat.1003205): proportion of flu viral copies reduced vs no mask on patient.
* [Fischer et al.](https://advances.sciencemag.org/content/6/36/eabd3083): relative droplet count as show in Fig 3
* [Kumar et al.](https://arxiv.org/pdf/2005.03444.pdf): simulation of leakage and airflow
* [van der Sande et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2440799/): protection factor from inside to outside (concentration ratio)
* [Lindsley et al.](https://www.medrxiv.org/content/10.1101/2020.10.05.20207241v1): proportion of cough aerosol blocked
* [O'Kelly et al.](https://www.medrxiv.org/content/10.1101/2020.08.17.20176735v1.full.pdf): fit of different mask types by untrained volunteers

We start by estimating a number for surgical masks specifically. The below table shows the various results from these studies:

|Source    |Measurement | Outcome|
|----------|------------|--------|
[Lindsley et al.](https://www.medrxiv.org/content/10.1101/2020.10.05.20207241v1) | Proportion of cough aerosol blocked | 60% (1.7x reduction) |
|[van der Sande et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2440799/)    | Protection factor                   | 2.5x |
|[Milton et al.](https://journals.plos.org/plospathogens/article?id=10.1371/journal.ppat.1003205) | Reduction of viral copies | 3.4x |
| | Reduction of "fine" aerosols | 2.8x |
| | Reduction of "coarse" aerosols  | 25x |
|[Davies et al.](https://www.researchgate.net/publication/258525804_Testing_the_Efficacy_of_Homemade_Masks_Would_They_Protect_in_an_Influenza_Pandemic) | Reduction of colony-forming units | 7x |
|[Kumar et al.](https://arxiv.org/pdf/2005.03444.pdf) | Proportion of airflow that leaks around mask | 12% (8x maximum protection) |
|[Fischer et al.](https://advances.sciencemag.org/content/6/36/eabd3083) | Reduction in droplet count from coughs | 10x |

We conclude that surgical masks are significantly better at blocking large particles (25x) than small ones (2.8x) [Milton et al.](https://journals.plos.org/plospathogens/article?id=10.1371/journal.ppat.1003205). 
It appears that coughs are filtered very effectively [[Davies et al.]](https://www.researchgate.net/publication/258525804_Testing_the_Efficacy_of_Homemade_Masks_Would_They_Protect_in_an_Influenza_Pandemic), [[Fischer et al.]](https://advances.sciencemag.org/content/6/36/eabd3083), which seems to imply that they are predominantly large particles. 
Thus, we chose a number slightly higher than Milton et al's overall number (3.4x), which is 1/4.

For masks that provide _less_ protection to others, we derive our estimates for thin and thick cotton masks by using relative comparisons to surgical masks and to one another. [Davies et al.](https://www.researchgate.net/publication/258525804_Testing_the_Efficacy_of_Homemade_Masks_Would_They_Protect_in_an_Influenza_Pandemic) Table 1 shows that a "scarf" is about 56-65% as protective as a surgical mask, and a "cotton mix" is 70-78% as protective as a surgical mask. [Davies et al.](https://www.researchgate.net/publication/258525804_Testing_the_Efficacy_of_Homemade_Masks_Would_They_Protect_in_an_Influenza_Pandemic) Table 4 suggests that the homemade mask was about 92% as effective at blocking colony-forming units as a surgical mask. [Fischer et al.](https://advances.sciencemag.org/content/6/36/eabd3083) shows the relative droplet count in Fig 3 for "bandanas" as 0.5, and for "cotton" as 0.2 (i.e. 80% of droplets filtered), implying a bandana is about 60% as effective. Finally, the [Lindsley et al.](https://www.medrxiv.org/content/10.1101/2020.10.05.20207241v1) proportion of cough aerosol blocked is 47% for polyester neck gaiter and 60% for a procedure mask (which we think is a surgical mask), implying a neck gaiter is 78% as effective as a surgical mask. Overall, in summary, we interpret these ratios as implying that a thick, well-fitted cotton mask would be about 80%-90% as effective as a surgical mask (which we estimated above reduces others' exposure by 4x), which makes 2.5x-3x protection which we round off for simplicity to **3x (1/3 multiplier) for thick cotton masks**. In turn, a thinner or worse-fitting homemade mask looks to be no less than 50% as effective as a surgical mask, which we round off to **2x (1/2 multiplier) for thin masks or worse fit**.

We didn't find any sources describing fitted masks with PM2.5 filters. We choose to guess that these are more protective than thick fitted cotton masks, and about as protective as a surgical mask due to similar fit characteristics and similarly being made from a fabric whose filtration properties were considered in the design, so we suggest the **1/4 multiplier for masks with PM2.5 filters**.

For masks that provide _more_ protection to others, such as KN95s and N95s, we make a distinction between getting a truly airtight seal, such that _all_ the exhaled air is going _through_ the mask, versus just wearing a rated mask on one's face without being sure it has sealed, allowing for some leakage.

Despite the _fabric_ often being highly rated for filtration, KN95 masks usually provide a loose fit, with visible gaps, roughly in the same ballpark of fit as a surgical mask ([O'Kelly et al.](https://www.medrxiv.org/content/10.1101/2020.08.17.20176735v1.full.pdf)). In our personal experience with earloop KN95s, we have not been able to get a firm/tight seal. We therefore would estimate their protection factor as being in roughly the same 1/4 ballpark as surgical masks (_not_ in the rated ballpark of 95% protection i.e. 1/20 reduction), but perhaps slightly higher due to improved fabric and somewhat improved fit. To quantitatively estimate the amount of improvement, we extrapolate from [Mueller et al.](https://www.cell.com/matter/pdf/S2590-2385(20)30364-7.pdf) who estimate how much better "cone-shaped" masks such as KN95s tend to fit than surgical masks, although their study was on protection-to-wearer rather than protection-to-others. They show about 10% better filtration performance (Fig 7B), which implies a slightly-improved **1/6 factor for KN95s** as contrasted with the 1/4 factor for surgical masks. We note this is a fairly speculative estimate, as the data on KN95s is limited. We also use this estimate as the protection-to-others factor for an N95 mask that the wearer has NOT checked for a seal.

For a NIOSH-rated medical-grade N95 mask that the user _has_ checked for an airtight seal (No outflow valve; No beards; No earloops, elastic headbands needed for tight fit) we don't find any studies measuring real-world source control properties, because most studies assume these masks are worn for PPE. Some studies already analyzed earlier in this section suggest extremely good protection to others from an N95: [Fischer et al.](https://advances.sciencemag.org/content/6/36/eabd3083) shows an incredibly small relative droplet count, below 0.001, as show in Fig S1; [Lindsley et al.](https://www.medrxiv.org/content/10.1101/2020.10.05.20207241v1) shows a 99% proportion of cough aerosol blocked. for N95 respirator. We assume therefore that sealed N95s provide very good protection, although we are reluctant to assign values higher than the NIOSH-rated 95% (1/20). To get to our final figure, we draw on the broad trend we observe in comparing protection-to-others factors (this section) with protection-to-self factors (next section) for the lesser-rated masks: across the board, we estimate approximately a 2x larger protection-to-others factor compared to the protection-to-self factor for the same mask type. Therefore, we start with a PPE analysis of well-sealed N95s (below), which estimates a 1/8 protection factor worn as PPE, and extrapolate a twice-as-good **1/16 protection factor for well-sealed N95s worn to protect others**.

Finally, when wearing a reusable **P100 respirator with the outflow valve covered** with fabric, we assume the same effect in protecting others as a fabric mask: **1/3**. This is a guess; the data behind the 1/3 estimate assumed some amount of "leakage" whereas a fully covered valve is more likely to direct _all_ the exhaled air through the fabric, which might suggest more outgoing protection; however, the exhaled air emerges in a more concentrated "jet", which might suggest less protection. We don't have a good way of knowing, so we go with our best guess.

We note that in a more nuanced analysis we might consider estimating a smaller protection factor at further indoor distances, and a larger protection factor at close distances, because surgical masks are particularly effective at stopping  droplets ([Leung et al.](https://www.nature.com/articles/s41591-020-0843-2)) which travel shorter distances. However, for ease of use, the microcovid model makes an independence assumption of the various mitigating factors and variables.


##### Masks: protecting the wearer

For wearer protection (i.e. PPE), we draw on the following sources, five of which are new in the latest revision of our estimates:
* [Mueller et al.](https://www.cell.com/matter/pdf/S2590-2385(20)30364-7.pdf): percent removal of particles from outside to inside of mask
* [van der Sande et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2440799/): protection factor from outside to inside (concentration ratio)
* [Konda et al.](https://pubs.acs.org/doi/10.1021/acsnano.0c03252): filtration efficiency of fabrics
* [Zhao et al.](https://pubs.acs.org/doi/10.1021/acs.nanolett.0c02211)
* [Offeddu et al.](https://pubmed.ncbi.nlm.nih.gov/29140516/): review and meta-analysis of healthcare workers
* [Chu et al.](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)31142-9/fulltext): meta-analysis
* [Liang et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7253999/): meta-analysis.
* [Lai et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3306645/): mannequins with aerosol spray
* [Gardner et al.](https://pubmed.ncbi.nlm.nih.gov/24011377/): P100 respirator performance against infectious airborne viruses

As with the protection-to-others estimates, we start with surgical masks. A handful of sources cluster around approximately a 2x protection factor ballpark, including [Offeddu et al.](https://pubmed.ncbi.nlm.nih.gov/29140516/) estimating 60% protection against respiratory illness in general, and 34% against flu; [Chu et al.](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)31142-9/fulltext) estimating 2-3x protection (although as Howard et al. observe, they put substatial weight on SARS and MERS results); [Liang et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7253999/) estimating that high-quality masks worn by non-healthcare-workers give 47% reduction; and [Lai et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3306645/) showing in Figure 5 (black vs. pink curve) an approximately 60% reduction in concentration at the mask-wearer's mouth under conditions of normal wearing. Additionally, [Konda et al.](https://pubs.acs.org/doi/10.1021/acsnano.0c03252)'s filtration efficiency of surgical mask fabric with a gap reported at 50%. Some results appear higher, including multiple measurements in the [van der Sande et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2440799/) paper that are in the 4x ballpark (see Table 1), and the [Mueller et al.](https://www.cell.com/matter/pdf/S2590-2385(20)30364-7.pdf) results showing 53%-75% particle removal. Some results come in lower, such as [Zhao et al.](https://pubs.acs.org/doi/10.1021/acs.nanolett.0c02211) estimating only 19-33% of particles blocked even with a tight seal. Overall we feel that **1/2 wearer protection from surgical masks** is an adequate summary of the data.

For durable cloth masks that fit well, we draw on the following sources: [Mueller et al.](https://www.cell.com/matter/pdf/S2590-2385(20)30364-7.pdf) shows particle removal in the range of 28%-91% from a well-fitting cloth mask; [Konda et al.](https://pubs.acs.org/doi/10.1021/acsnano.0c03252) show filtration efficiencies from 2-layer cotton in the range of 38%-82%; [van der Sande et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2440799/) measure a protection factor of 2.5x. Overall, it seems that some cloth masks achieve comparable efficiency to a surgical mask, but there's substantial variance; since the lower end of the range is in the 30% ballpark, we feel comfortable suggesting **a 2/3x multiplier to the wearer from a thick and well-fitted cotton mask**.

For thin, light materials and poor fit, we did not find any evidence suggesting substantial protection to the wearer. [Konda et al.](https://pubs.acs.org/doi/10.1021/acsnano.0c03252) suggest only 9% filtration from a quilter's cotton fabric. We suggest **no protection, a 1x multiplier, to the wearer from thin or loose-fitting masks**

For KN95 protection-to-wearer, we use the same data from [Mueller et al.](https://www.cell.com/matter/pdf/S2590-2385(20)30364-7.pdf) about cone-shaped masks showing they are an improvement over surgical masks but not drastically so. Additionally we draw on [Lai et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3306645/) showing that a face mask that is sealed on three sides (but open on the fourth) is about 60% protection, which leads us to think that **a 1/3x multiplier from a cone-shaped KN95**, as compared with a 1/2x multiplier from a surgical mask, is a reasonable estimate.

For well-fitted and well-sealed N95 masks (no outflow valves, tight-fitting elastic headbands, and no beards) we draw our number from [Offeddu et al.](https://pubmed.ncbi.nlm.nih.gov/29140516/). In Fig 5C, they show a number of studies that found a risk ratio of 0.12 between healthcare workers who wore N95's while working with SAR-COV-1 patients and healthcare workers who wore no mask. This represents an 88% relative risk reduction, or a multiplier of 1/8.

We note that Offeddu et al, along with several other papers including [Long et al.](https://pubmed.ncbi.nlm.nih.gov/32167245/) and [Radonovich et al.](https://jamanetwork.com/journals/jama/fullarticle/2749214) found lower effectiveness at N95 masks reducing the rates of influenza among healthcare workers. We note (as do several of these papers) that these studies are unable to determine whether the workers were infected by patients or by normal community spread; all of the infection rates fall well within average population rates for influenza. Thus, we consider these studies underpowered for determining efficacy of PPE.

In our original writeup, we cited that [Chu et al.](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)31142-9/fulltext) finds a difference between N95s (adjusted odds ratio of 0.04) versus other masks (adjusted odds ratio of 0.33) in contracting diseases such as SARS and MERS that workers were unlikely to contract in their daily lives. 

As a sanity check, we offer several studies that test the filtration characteristics of N95 masks:
 * [Mueller et al.](https://www.cell.com/matter/pdf/S2590-2385(20)30364-7.pdf) showed 90% of small particles were blocked (less than 0.3 micron); 
 * [Zhao et al.](https://pubs.acs.org/doi/10.1021/acs.nanolett.0c02211) showed 95% blocked; 
 * [Konda et al.](https://pubs.acs.org/doi/10.1021/acsnano.0c03252) showed 85% protection with no gap; 
 * [van der Sande et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2440799/) show multiple measurements above 85x (!) protection; 
 * [Lai et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3306645/) show that the protection from a fully-sealed mask is >89%, and drops to >80% with small leakage. 

Overall, Offeddu et al. is the most compelling study, so we use a factor of 1/8x, acknowledging that this could be as little as 1/5x (80% filtration) if there is some leakage, or as much as 1/20x (95% filtration) in cases of perfect usage. 

We note this is slightly less than the [Respirator assigned protection factors](https://en.wikipedia.org/wiki/Respirator_assigned_protection_factors) for this type of PPE, explained in more detail in the next paragraph.


Estimating the wearer protection from a resuable NIOSH-approved P100 respirator requires looking beyond the infectious disease literature, as these types of respirators are seldom worn in healthcare settings or studied in real-world protection from infectious disease. [Gardner et al.](https://pubmed.ncbi.nlm.nih.gov/24011377/) show in controlled conditions that P100 respirators met or exceeded their rated 99.97% filtration efficiency in filtering out viral particles in an aerosolized liquid suspension, so we do not doubt that P100 masks are fully as protective against viral aerosols as they are against other contaminants. The question that remains is what the *real-world* likelihood is of an untrained person getting a perfect seal. For this, we defer to standardized [Respirator assigned protection factors](https://en.wikipedia.org/wiki/Respirator_assigned_protection_factors) (APFs), which convert rated filtration efficiencies to the expected real-world  decrease of the concentration of inhaled contaminants, based on studies in the workplace. For our P100 estimate, we choose to use the higher protection value of **20x** from the UK FFP3 mask, rather than the 10x value used in the US, because the US value is assuming a truly grueling "worst case" - work in the polluted atmosphere of 8 hours per day, 40 hours a week - and we assume calculator users are not intending to wear P100s for this duration.

One note is that we are additionally drawing on our personal experience in feeling comfortable recommending a higher protection factor for P100s than for N95s, because in our experience helping friends get a seal on their mask, it is *vastly* easier for an untrained person to get a reusable P100 respirator to seal well on their face than it is for them to get a seal on an N95, even if it is the right shape and size for their face which is far from guaranteed.

For users seeking even higher protection than 1/20, we suggest eye protection, including full-face masks, as described in the [Respirator assigned protection factors](https://en.wikipedia.org/wiki/Respirator_assigned_protection_factors) wikipedia page.


#### Outdoor / Ventilation

##### Outdoor
This is one of the tougher numbers to estimate, but we currently feel good estimating that being outdoors reduces your risk by more than 20x (unless you’re super close together, in which case we’re really not sure).

Almost every news article about outdoor transmission cites the same two sources: [Nishiura et al.](https://www.medrxiv.org/content/10.1101/2020.02.28.20029272v2) and [Qian et al.](https://www.medrxiv.org/content/10.1101/2020.04.04.20053058v1) Nishiura et al. is the source of the “18.7x” figure that we see all over the place, but we don’t put much stock in this specific paper for two reasons. For one, many summaries seem to miss that this is an _odds ratio_ and not a relative risk ratio (that is, it tells us that 18.7x as many of the transmissions came from indoors, but if people in general usually had 18.7x as much indoor contact as outdoor contact, this would not imply any difference in risk!).[^1] For another, Nishiura et al. also uses a very small sample size, it’s only six scant pages with very little explanation, and we can’t make heads or tails of the bar chart at the end.

Instead, we put stock in two sources:



*   [Qian et al](https://www.medrxiv.org/content/10.1101/2020.04.04.20053058v1) looked at 7,324 identified cases in China, and only found one outdoor outbreak involving two cases (which we interpret as one primary case, who had a conversation with the secondary case). Americans spend about [8% of their time](https://www.statista.com/chart/21408/time-americans-spend-indoors-outdoors/) outside; if we assume the same holds in this population, and close contact follows the same distribution, and there was no difference in indoor and outdoor risk, then this would imply 629 outdoor cases in expectation. A factor of several-100x lower risk needs to be accounted for somehow, through some combination of reduced outdoor risk and overestimating number of outdoor contacts.
*   Professor Jose Jimenez’s Google sheet [Aerosol Transmission Model](https://docs.google.com/spreadsheets/d/16K1OQkLD4BjgBdO8ePj6ytf-RpPMlJ6aXFg3PrIQBbQ/edit#gid=519189277)[^2], which is one of our absolute favorite resources so far. Professor Jimenez models the Skagit Choir outbreak, and then re-does the model again as though the choir had been outdoors, and finds transmission rates 100x lower outdoors. Notably, this model does NOT include the contribution of larger respiratory droplets, and assumes 6ft social distancing.

There’s also anecdotal evidence. In addition to the reports that there was no [significant protest-related surge](https://www.nytimes.com/2020/07/01/nyregion/nyc-coronavirus-protests.html) as a result of the Black Lives Matter protests, we also heard from a friend of ours who took a CO2 meter to a crowded protest and observed that the CO2 readouts were totally flat, implying minimal density or buildup of exhalations.

Finally, there have been zero outdoor outbreaks of any kind in the US, whereas in Colorado 9 percent of outbreaks [are reported](https://www.nytimes.com/2020/08/12/health/Covid-restaurants-bars.html) to have been traced to bars and restaurants, despite the fact that both indoor and outdoor restaurant dining are open throughout the US.

The sources above hint at up to a 100x benefit. Fellow armchair modeler Peter Hurford assumes a 5x benefit from being outdoors. We feel good about calling it “more than 20x” for now and waiting for more evidence, with a warning about not trusting this number if you’re very close to one another because we have no data about outdoor cuddling.

##### Ventilation
We draw our figure for room with HEPA filters from [Curtius & Schrod](https://www.medrxiv.org/content/10.1101/2020.10.02.20205633v2), who found that running HEPA filters in a class room with total hourly flow rate equal to 5x the volume of the room to decrease the concentration of aerosols in the room by 90%. They further project that this would decrease the liklihood of COVID transmission by 3x for a 1-hour interaction and 6x for a 2-hour interaction. We split the difference apply 4x in the calculator (but note that the longer your interaction lasts, the greater an impact air purifiers will have). We note that simply circulating air is insufficient - the air must either be exchanged with the outside or passed through a high quality filter (HEPA is equivalent to P100; HVAC filters rated on the MERV scale do not meet this critieria.)

It's important that your filter is actually circulating sufficient air.
* Look up the model of your air purifier online; it should have a rating in CFM, which will be for running at maximum.
* Measure the length and width of your room in feet.
* For a normal room height (8ft), ensure \`CFM > 2/3 * length * width\`

The derivation of this rule is as follows:
\`\`\`
Refreshes/hr = 60 min/hr * CFM ft^3/min / (length ft * width ft * height ft) = 5
60 * CFM / (length * width * height) = 5
CFM = 5 * (length * width * height) / 60
CFM = 1/12 * (length * width * height)
if height = 8ft,
CFM = 2/3 * (square footage)
\`\`\`

From this, we also deduce that areas that have high rates of air exchange while not being "outside" per-se should be similarly safer. This includes cars with the windows rolled down and partially enclosed spaces (i.e. at least one wall is open to outside air).

Finally, many mass transit options have very high air circulation standards, so we apply the same risk reduction. For instance, SF's [BART](https://www.bart.gov/news/articles/2020/news20200813) claims that their trains circulate and purify air every 70 seconds, or 50 times an hour.

On planes, [Silcott et al](https://www.ustranscom.mil/cmd/docs/TRANSCOM%20Report%20Final.pdf) directly measured aerosol concentrations on a plane and found that the plane's filtration system resulted in 90% less exposure than a house. Since this is the same reduction as Curtis & Schrod found, we reason that the same reduction should apply. However, plane rides tend to be 2+ hours, so we use the 6x reduction that Curtis & Schrod calculated.

#### Distance
This is another [Chu et al](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)31142-9/fulltext) estimate. Each meter of distance was associated with about a 2x reduction in infection risk; specifically they find that being one meter apart is 2x better than baseline, and two meters 2x better than one meter. They speculate, and we agree, that three meters is thus likely at least 2x better than two meters. Although these data come from a healthcare setting in which “0m” means direct physical contact with the patient, we instead conservatively take “baseline” as “normal socializing” ≈ one meter. When doing our own personal risk calculations, we estimate “cuddling” = zero meters as twice as risky as baseline.

We get some corroboration for this number from the study of train passengers, [Hu et al.](https://academic.oup.com/cid/advance-article/doi/10.1093/cid/ciaa1057/5877944) Looking for example at Figure 3, for passengers that were 1 row apart, moving an additional 2 columns away (seats 0.5m wide, so about 1m away) decreased the risk from what we eyeball as 0.2ish to 0.1ish, and then from 0.1ish to 0.05ish for an additional 2 columns. It’s worth noting that they report a steeper drop from sitting _right next to_ the index patient to sitting 1m away, which could be relevant to hangouts at closer than a normal social distance from someone.

## Person Risk

### Basic Method: Underreporting factor

Previously we rolled out own estimation of underreporting factor based on raw caseloads. We now follow the model buit by [COVID-19 Projections](https://covid19-projections.com/estimating-true-infections-revisited/). Their team fit a model to seroprevalance data from various points in the pandemic.

The model they use is:
![Prevalance model](https://covid19-projections.com/assets/images/etir_equation.png)
This model works on the assumption that testing availability has steadily improved over the course of the pandemic, such that the impact of the positive test rate decreases as the pandemic continues. Our original model was based on a snapshot of testing availability early in the pandemic, which is now overly pessimistic.

For historical purposes, here is the original model that we used:
> In order to make suggestions about underreporting factor, we threw together a quick comparison of two data sources.
>
> * The first data source is state-by-state historical Positive Test Rates from [Covid Act Now](https://covidactnow.org/).
> * The second is the CAR (case ascertainment ratio) columns of [this table](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7239078/bin/NIHPP2020.04.29.20083485-supplement-1.pdf) from the NIH, as explained in [Chow et al.](https://www.medrxiv.org/content/10.1101/2020.04.29.20083485v1) (which used a computational model to estimate these numbers).
> * We typed these in by hand hastily. We excluded the NY and NJ numbers as the two that did not have a specified Positive Test Rate, being listed just as "over 20%", in the relevant timeframe. If you would like to check our work, this [code snippet](https://gist.github.com/catherio/8d95858c0f69023a9d5427fc5ef02671) shows what we did.
>
>There was a visible correlation, so we eyeballed some approximate ranges. Here's the data we see, with a simple linear regression line drawn on top. We eyeball this as being roughly "1 in 6" on the left-hand side; "1 in 8" in the middle; and "1 in 10" on the right-hand side.
>
>![Positive test rate](${positiveTestRate})

#### Contagiousness adjustment

The way we're using the prevalence numbers in our model assumes everyone in your area with COVID is equally likely to give it to you. But in reality, that's probably too pessimistic:

* A high proportion of all cases are asymptomatic. There's some uncertainty about the exact fraction, but a literature review by [Oran et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7281624/) estimates 40-45%.

* Asymptomatic cases are less likely to ever be tested than symptomatic cases, because symptoms prompt people to get tested. In the absence of symptoms, you'll only know you have COVID from contact tracing or from an effectively "random" / "just to be sure" test. This implies that asymptomatic cases are likely to be a relatively smaller fraction of _reported_ cases than of _all_ cases.

* Asymptomatic cases are probably responsible for quite a low proportion of infections. [Ferretti et al.](https://science.sciencemag.org/content/368/6491/eabb6936) concluded that only 5% of infections were caused by someone asymptomatic (i.e., who will never show symptoms no matter how long you wait).

* Our data about transmission likelihood (Activity Risk) are probably drawn from mostly symptomatic index cases. Thus, asymptomatic cases are likely to be less risky than our model would indicate.

In a region with positive test rates below 5%, we estimate the number of infected people as 6x the number of reported cases. But if reported cases are relatively more likely to be symptomatic, and unreported cases relatively less so, and asymptomatic cases are less risky in terms of onward transmission... then there's an argument that just multiplying the number of reported cases by 6 is too pessimistic. Even if the number of infections is 6x the reported case count, the risk to you would be lower since so many of those cases are asymptomatic. Maybe the increase in risk due to those unreported infections is only 4x or 5x, even though the underreporting factor is 6.

We can make a fairly speculative guess at what this "contagiousness-adjusted" underreporting factor should be, as follows. Testing provider [Color](https://www.color.com/new-covid-19-test-data-majority-of-people-who-test-positive-for-covid-19-have-mild-symptoms-or-are-asymptomatic) observes that 30% of their positive test results do not have any symptoms at the time of testing, and thus we infer are either presymptomatic or asymptomatic. If we again use the ratio from [Oran et al.](https://www.acpjournals.org/doi/10.7326/M20-3012), we might guess 40% of those 30% will never show symptoms; which is to say, we guess 12% of all [Color](https://www.color.com/new-covid-19-test-data-majority-of-people-who-test-positive-for-covid-19-have-mild-symptoms-or-are-asymptomatic)-reported positive tests are from asymptomatic cases, and the remaining 88% are from presymptomatic and symptomatic cases. By contrast, 60% of all *total* infections found via blanket testing of everyone in a region (by [Oran et al.](https://www.acpjournals.org/doi/10.7326/M20-3012) again) are presymptomatic or symptomatic. This tells us that we might expect 0.6/0.88 = ~2/3 as many of the unreported cases are highly contagious (by virtue of being presymptomatic or symptomatic instead of asymptomatic). While this calculation is far from perfect, it gives us a rough estimate that could be used as a "contagiousness adjustment factor" of 2/3. And that would imply that the minimum underreporting factor could be 4x, not 6x.

We have chosen _not_ to apply this adjustment to the estimates we
report in the main text: the underreporting factors of 6x/8x/10x
assume all cases are equally contagious. We made this choice because
of how speculative the adjustment is. Even though we're reasonably
sure from first principles that there should be _some_ effect along
these lines, we're quite uncertain about its magnitude. So, we'll
treat the effect as an unknown safety margin rather than using it
to reduce our prevalence estimate.


### Infectious period

We state in the [Advanced Method](https://www.microcovid.org/paper/9-advanced-method) that a person’s risk is the sum of all of someone's activities between 2 and 9 days ago. This is an approximation based on the more complex model used by the Risk Tracker, which is based on the following sources:

- [Ferretti et al](https://science.sciencemag.org/content/368/6491/eabb6936) shows that transmission to someone else within 2 days of getting infected is very unlikely.
- [McAloon et al](https://bmjopen.bmj.com/content/bmjopen/10/8/e039652.full.pdf) gives us a distribution of how long it takes for a person to develop symptoms:
![](${mcaloonIncubationPeriod})

- [Byambasuren et al](https://jammi.utpjournals.press/doi/10.3138/jammi-2020-0030) tells us that 17% of COVID cases never develop symptoms and these cases are 42% as likely to transmit COVID to others compared to patients who have or will develop symptoms.
- [Covid Strategy Calculator](https://covidstrategycalculator.github.io/CovidStrategyCalculator.html) gives us a distribution for probability of infection conditioned on not having symptoms, which we combine with McAloon et al. to derive a lognormal distribution for risk of never symptomatic cases.
- [Lee et al.](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2769235) Shows that 50% of cases that are never symptomatic are completely recovered (undetectable amounts of virus) in 16 days and 90% are recovered in 23 days.

Combining these sources, we built a model that accounts for time to developing symptoms, proportion of cases that are asymptomatic, and decreased infectiousness of asymptomatic individuals:

![](${infectiousDecayModel})

This peaks on day 2 and decays over time. Since the risk starting around day 20 is small, we arbitrarily choose a cutoff time of 23 days, which yields an infectious window of exactly 3 weeks (2-23 days).

Many people have a weekly routine, which makes modeling their risk for 7 days compelling. If a person regularly gets a total of \`X\` microCOVIDs over the course of 7 days and they do the same activities each week, then learning they are currently symptom-free allows us to estimate their *current* risk of having COVID as 60% lower than their weekly total X.

Explaining how we calculate that: they will have done the activity exactly 3 times in any past 2-23 day window so we can estimate that their risk on any given day will be:

\`3 * X * SUM(Relative Risk) / 21 days = 0.6 * X\`

Therefore a person with a regular schedule could be modeled based on their normal 7 day week, but users tracking risk with the Risk Tracker will be able to more precisely know the risk they pose to others on any given day.

The 2-9 day window cited elsewhere in the whitepaper is one way of simplifying this decay over time, by treating it as though there is no decay from day 2 through 9, and then all the decay occurs as a sharp step on day 10. This is purely a simplification: there is absolutely nothing magical about day 9; in reality, on day 10 there is still 16% of the original risk left. If a person’s risky activities do not follow a 7 day cycle, and they have some something very risky more than 9 days ago, you may need to ask them for what they have done for up to the last 2 or even 3 weeks.

### Note on Infectious Period: Contacts' symptoms

Another important thing to know about the infectious period is that only about 9% of transmissions from people who eventually show symptoms occur more than 3 days before those symptoms appear, and only 1% occur more than 5 days before symptoms appear. We get this data from [He et al](https://www.nature.com/articles/s41591-020-0869-5), Figure 1c middle graph:[^heupdate]

![He et al](${heExtended})

One insight we can gain is that since 50% of transmission occurrs after symptoms onset, if you confirm with the person you are seeing that they don't have symptoms right before you interact, you are reducing your risk by 50%.

Additionally, only about 6% of transmissions come from people who won't ever show symptoms ([Ferretti et al](https://science.sciencemag.org/content/368/6491/eabb6936)):[^ferretti]

![Ferretti et al](${ferrettiFig2})

These two facts combined imply that, if you interacted with someone more than 3 days ago, and that person has not yet shown symptoms, then you should be about 7 times more confident than you were before that they did not transmit COVID to you: \`0.94*0.09 + 0.06 = 0.14 ≈ 1/7\`.

And if your interaction was 5 days ago and your contact still has no symptoms, you should have an additional 2x as much certainty (total of 14 times more confident): \`0.94*0.01 + 0.06 = 0.07 ≈ 1/14\`.

To see where these factors might be useful in practice, imagine that Alice lives with risk-averse housemates but wishes to spend undistanced time with her partner Bob, who generally acts in riskier ways. Without further information, Alice might imagine that she needs to isolate for 10 days after spending time with Bob in order to avoid exposing her housemates to more risk than they're comfortable with. But suppose seeing Bob is the only high-risk thing Alice is doing, and suppose that Alice and her housemates have modelled Bob using the Advanced Method and all agree that he is only 5x "too risky." (That is, if Bob were 5x less likely to have COVID at the time of Alice's visit, Alice's housemates would be fine with Alice seeing Bob and then coming back home without further isolation.) Then Alice could safely follow a procedure where she:
* has her visit with Bob;
* waits 3 full days without interacting with Bob or her housemates;
* verifies that Bob is not experiencing any potential symptoms of COVID-19, even mild or ambiguous ones;
* and then returns home.

This works because Bob is less than 7x "too risky." If he were 10x "too risky," Alice could safely wait 5 days instead of 3, because 10x is less than the 14x increased confidence that you can have after 5 days.

If each visit only requires 3 or 5 days of isolation instead of 10, Alice can probably see her partner more often, which is likely to be good for both Alice's and Bob's mental health.

## Vaccines

### Assumptions

- We use [Byambasuren et al.](https://www.medrxiv.org/content/10.1101/2020.05.10.20097543v3.full.pdf) as our source for transmission from asymptomatic cases; they found that (in an unvaccinated population), 17% of cases never have symptoms and these individuals are 42% as likely to transmit COVID as individuals who eventually have symptoms.
- We assume that individuals who are tested once per week with a PCR test and never test positive are not infectious to others. This is not a perfect, as PCR tests have a non-trivial false negative rate, but we presume that the false negative rates in control and trial groups cancel out.

### AstraZeneca
AstraZeneca’s [trial](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3777268) used at-home test kits to test for asymptomatic cases of COVID.
They found that, 14 days after administration of the second dose, compared to the control group, 
the people in the vaccinated group were both less likely to test positive for symptomatic COVID and less likely to test positive for asymptomatic COVID,
indicating that the vaccine is doing better than simply preventing symptoms. The aggregate results were:

|                         | Control Group | Vaccinated Group |
| ----------------------- | ------------- | ---------------- |
| Participants            | 8600          | 8600             |
| Severe Cases            | 10            | 0                |
| Symptomatic Cases       | 248           | 84               |
| Never symptomatic cases | 73            | 57               |

Treating never-symptomatic cases as .42 relative infectiousness, this gives: 
control group adjusted infectiousness: \`(1 * 248 + 0.42 * 73) = 279\` 
vaccinated group adjusted infectiousness: \`(1 * 84 + 0.42 * 57) = 108\`
The relative infectiousness of the vaccinated group is therefore \`108 / 279 = 0.39\`
We take this as our overall recommended microCOVID multiplier 14 days after the 2nd dose of the AstraZeneca vaccine, which we round to **0.4**.

As a side note, we also observe that AstraZeneca's trial found 10 cases of severe COVID, all in the control group. Using a confidence interval calculator[^confidence-interval], we estimate a reduction in risk (of severe COVID specifically) of 90%, 95% CI of (22%, 100%)

### Moderna & Pfizer
Moderna’s and Pfizer’s vaccines (which are the most common vaccines in the United States) are similar in both design and efficacy, so we consider them together. Unfortunately, Phase III trials from both Moderna and Pfizer only tested for symptomatic COVID, which makes it more difficult to estimate the overall reduction in *total* infections (including never-symptomatic cases). However, we use supplementary data to estimate the reduction in never-symptomatic COVID as well. Here we first explain the data from the Phase III trials, and then explain how we augment their data to reach our overall estimate.

Below is the data from the Phase III studies. This data shows that these two vaccines are very, very effective at preventing symptomatic COVID (95% for Pfizer and 94% for Moderna). However, it does not yet allow us to estimate the overall reduction.

Data from [Pfizer’s phase 3 study](https://www.nejm.org/doi/full/10.1056/NEJMoa2034577):

|                   | Control Group | Vaccinated Group |
| ----------------- | ------------- | ---------------- |
| Participants      | 21,728        | 21,720           |
| Symptomatic Cases | 162           | 8                |
| Severe Cases[^pfizer-supplement]| 4             | 1                |

Data from [Moderna’s phase 3 study](https://www.nejm.org/doi/full/10.1056/NEJMoa2035389):

|                   | Control Group | Vaccinated Group |
| ----------------- | ------------- | ---------------- |
| Participants      | 15,210        | 15,210           |
| Symptomatic Cases | 185           | 11               |
| Severe Cases      | 30            | 0                |


Fortunately, we have access to a [supplement provided to the FDA](https://www.fda.gov/media/144453/download), which provides a useful clue about reduction of non-symptomatic cases. In this supplementary data, Moderna showed a 63% reduction in positive PCR swabs at the time of the 2nd dose among people who had no symptoms of COVID up to that point. Some of these people might've later shown symptoms. This indicates that the total reduction in Later-Symptomatic + Never Symptomatic COVID cases from *the first dose* of Moderna’s vaccine was 63%.

We therefore use \`1 - 0.63 = 0.37 \` as a conservative estimate of the reduction of total COVID cases in the vaccinated group. Likely it is even better after the second dose. We also note that, from Byambsuren et al. again, if 17% of cases are never symptomatic, then there are 1/(1-0.17)=1.2x as many symptomatic-and-asymptomatic cases combined as there are never symptomatic cases. From this, we construct the following chart:

|                                                         | Control Group                | Vaccinated Group            |
| ------------------------------------------------------- | ---------------------------- | --------------------------- |
| Participants                                            | 15,210                       | 15,210                      |
| Symptomatic Cases                                       | 185                          | 11                          |
| Symptomatic + Asymptomatic                              | 222 (1.2x symptomatic cases) | < 82 (0.37 x control group) |
| Never symptomatic cases<br>(subtract previous two rows) | 37                           | < 71                        |

Now we can calculate the overall effect on contagiousness:
Control group adjusted contagiousness = \`185 * 1 + 37 * .42 = 200\`
Vaccinated group adjusted contagiousness = \`11 * 1 + 71 * .42 = 40\`
Relative contagiousness of vaccinated group = \`40 / 200 = 0.2\`

We assume that Pfizer's vaccine has similar performance as Moderna's on the basis of similar design and reported metrics.

Post Phase III studies for Moderna and Pfizer are in progress, we expect to update these numbers as data becomes available.

The overall risk reduction for preventing severe cases of Moderna is 97%. We calculate a 95% CI of (76.5, 100)[^confidence-interval]

Pfizer cites a 75% vaccine effectiveness at preventing severe disease, with a 95% CI of (-152.6, 99.5)

### Single Shot Efficacy
For vaccines require 2 doses, we see reductions in symptomatic COVID after a single shot of about 50% across Moderna, Pfizer, and AstraZeneca. Moderna further provided data suggesting a 63% reduction in total cases (symptomatic and otherwise). This gives us the following estimated case distribution:

|                            | Control Group                         | Single Dose Vaccinated            |
| -------------------------- | ------------------------------------- | --------------------------------- |
| Symptomatic + Asymptomatic | 1                                     | <0.63 (from Moderna’s supplement) |
| Symptomatic                | 0.8 (ratio from Byambasuren, Moderna) | 0.4 (~50% reported reduction)     |
| Asymptomatic (subtract)    | .2                                    | <.23                              |

This gives an overall multiplier of \`(0.4 + .42 * .23) / (0.8 + .42 * .2) = 0.56\`
HOWEVER, data that immunity is much shorter-lived in individuals with one dose of a 2 dose vaccine. We recommend getting the second dose as soon as it is available.


[^1]:
     We find it easier to understand the difference between an odds ratio and a risk ratio in a medical context. If 100 people walk into your clinic with heart disease, and twice as many were smokers as non-smokers, then the odds ratio is 2x. But that doesn’t tell you what you would get if you _started_ with 50 smokers and 50 nonsmokers and watched for heart disease later. You don’t know what the base rate of smoking was in your original dataset. See [https://psychscenehub.com/psychpedia/odds-ratio-2](https://psychscenehub.com/psychpedia/odds-ratio-2) for more on this.

[^2]:
     We understand there’s currently somewhat of a [debate or discussion](https://slate.com/technology/2020/07/droplets-aerosols-coronavirus-covid-19.html) around whether COVID is best thought of as being transmitted by smaller droplets that can linger in the air, or mostly by larger droplets that fall down quickly due to gravity. We already thought the evidence was pointing towards lingering droplets, and [Prof. Jimenez’s writeup](https://docs.google.com/document/d/1Kx4Mka_nORa8LlEwziRYZxOX0J8_fFfgnt-9TBjxusc/edit) on the topic summarizes this perspective far better than we could.

[^heupdate]: If you were previously familiar with this source, note that it was substantially updated in a [07 Aug 2020 author correction](https://www.nature.com/articles/s41591-020-1016-z).

[^ferretti]: There's an inconsistency in Ferretti et al, where the main text states that total transmissions come "10% from asymptomatic individuals (who never show symptoms), and 6% from environmentally mediated transmission via contamination.", whereas Figure 1 and Table 2 report the reverse, 6% from asymptomatic and 10% from environmental. We choose to go with the Figure 1 and Table 2 estimates.

[^pfizer-supplement]: Data on severe cases for Pfizer's vaccine is provided in their [supplement](https://www.nejm.org/doi/suppl/10.1056/NEJMoa2034577/suppl_file/nejmoa2034577_appendix.pdf)

[^confidence-interval]: We use the calculator on [Scale Statistics](https://www.scalestatistics.com/relative-risk.html) to calculate confidence intervals when none is provided. For situations where one group has 0 cases, we substitute 1 for this computation.
`

const post = { title, shortTitle, content }

export default post
