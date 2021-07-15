import { spreadsheetUrl } from 'components/RiskTrackerUtil'

const title = 'Basic Risk Tracker Usage'
const shortTitle = 'Basic Usage'
const content = `
## Orienting yourself to the Risk Tracker

**Sheets for regular use:**

*   **Pod Overview:** Track your current points total relative to your weekly budget.
*   **Pod Activity Log:** Where you log the activities for every person in your pod.
*   **Custom People:** Allows you to precisely model the people you are seeing.
*   **Locations:** Allows you to automatically track the COVID prevalence in your area (or the areas of the people you are seeing).
*   **Example Activities:** A “menu” of examples activities to give you an idea of how to log things.
*   _All sheets that start with “INTERNAL” are for internal calculations. Editing these may break the spreadsheet._

## What kinds of activities should be logged?

To accurately track your risk against your budget, you will want to log any activity where:

* You are sharing indoor air space with anyone
* You are outdooors and within 15 feet of someone for more than a passing moment

We've developed a detailed list of [risk activity questions](/questions) that you can use to help you think of which activities you've done that you would want to log.

You do not need to log any activities with people who are in your [microCOVID Pod](./household-pod) if you are all tracking your risk together. If others in your househould/pod are not tracking their risk in a shared system (like the spreadsheet), you will need to log your interactions with them.

Your pod may decide to not log things that are under a certain threshold (for example: anything equal to or less than 3 points).

**Resource:** We have created a [Risk Questions page](/questions) that you (and/or your contacts) can use to think through specific activities that you would want to log in order to have an accurate account of your budget.


## Logging an activity

**Here are the steps to log an activity in the Risk Tracker**
1. **Go to the _Pod Activity Log_ sheet** and find the section with your name.
2. **Fill in the row for your activity:**  You can hover over the header of each column to see detailed instructions.
3. **Check the result:** Go to the _Pod Overview_ sheet to see how this activity fits relative to your budget. The graph at the top tells you how many points are remaining in your weekly budget and the total number of points you've used in the last 7 days.
4. **Adjust as-needed:** If you are modeling an activity in advance of doing it and it is using more of your budget than you would like, see if there are additional precautions you can take to lower the risk (for example: wear a better mask, move it outdoors, distance, reduce the duration, etc.).

**NOTE:** If you run out of rows in your section, [follow these steps to insert new rows](./faq#how-do-i-insert-new-rows-into-the-activity-log).

See the _Example Activities_ sheet for examples that can help you understand how to fill in an activity row.

See also, [Activity Modeling FAQ](./faq#activity-modeling).


## Using the built-in Person Risk types

This table provides a fuller explanation for each of the Built-in Person Risk profiles to help you know when to use them.

<table>
  <tr>
   <td><strong>Built-in Person Risk Profile</strong>
   </td>
   <td><strong>What it means & when to use it</strong>
   </td>
  </tr>
  <tr>
   <td>Avg local resident
   </td>
   <td>The unknown person one may encounter at a grocery store, restaurant, or any other public place.
   </td>
  </tr>
  <tr>
   <td>Avg local resident who works from home
   </td>
   <td>A known person who has no in-person interactions with the public or other coworkers as part of their job. Assumed to have the same errand and socialization patterns as an average local resident.
   </td>
  </tr>
  <tr>
   <td>A healthcare or social worker
   </td>
   <td>The unknown person one may encounter in public spaces where their position is obvious,  such as cashiers, tellers, servers, healthcare workers,  etc.
   </td>
  </tr>
  <tr>
   <td>Lowest possible risk
   </td>
   <td>As a safeguard, we assume that no one can ever be more than 100x less risky than the current "average person" your local area.
   </td>
  </tr>
  <tr>
   <td>1%/0.1% risk per year adherent (using microCOVID)
   </td>
   <td>A known person who has been using microCOVID to stay within a specific risk budget.
   </td>
  </tr>
  <tr>
   <td>Known COVID case
   </td>
   <td>A person who has a confirmed case of COVID. Use this Person Risk profile if you’ve interacted with the person up to 10 days before the test was taken or up to 14 days after.
   </td>
  </tr>
  <tr>
   <td>Lives with partner, both people isolating
   </td>
   <td>A known person who cohabitates with only their partner and collectively goes on one grocery/errand run a week. No other in-person socialization or contact with the outside world; unless masked, outdoors, and beyond 20 feet masked.
   </td>
  </tr>
  <tr>
   <td>In a closed pod of 4/10/20 people (who only get groceries and see each other)</strong>
   </td>
   <td>A known person who only interacts with 4/10/20 people who only interact with each other. This means collectively one grocery/errand run a week. No other in-person socialization or contact with the outside world for the entire group; unless masked, outdoors, and beyond 20 feet.
   </td>
  </tr>
  <tr>
   <td>Has 1/4/10 close contacts whose risk profile we don't know. No other risk activities.
   </td>
   <td>A known person who has close contact (including roommates) with 1/4/10 people who are in contact with the outside world (may be unmasked, indoors, or within 20 feet of others). Assumes all people have done one grocery/errand run in the past week.
   </td>
  </tr>
  <tr>
   <td>Has 1 close contact who is a healthcare or social services worker. No other risk activities.
   </td>
   <td>A known person who has one close contact (including roommates) who works directly with the public in health care or social services work. The person themselves has gone one one grocery/errand run in the past week. 
   </td>
  </tr>
  <tr>
   <td>Went to a bar / party in the last 10 days
   </td>
   <td>A known person who spends 6 hours per week in settings where people are close together, unmasked and talking loudly.
   </td>
  </tr>
</table>



## Using the Custom People sheet to model risk more precisely

The more we know about the person’s details, the more precise their Person Risk value will be. If the person has taken low-risk actions in the last 10 days, the risk to you will likely be lower than if you used any of the built-in Person Risk types.

**Guiding principle: When there is uncertainty, overestimate.** Given the risk involved with COVID, we find it best to overestimate if there is uncertainty about some aspect of the person’s activities in the last 10 days.


### Steps to model a person

The good news is that modeling a custom person is almost exactly the same as modeling your own activities.

1. **Ask them about their behavior in the last 10 days**
    *   The more you know about what they have done in the last 10 days, the more accurate you can be. Since we are overestimating when there is uncertainty, quite often being more precise will reduce the person’s risk score.
    *   **Tip:** If you wish, you can send them our [recent activity questions](/questions) as a way to make the process clearer and smoother.
    *   **Note:** Modeling someone's activities for the last 10 days is only accurate when their risk score is relatively low. If they have done anything beyond their "standard week" in the last 21 days, you may want to include those activities in their entry. You can read more about doing so in the [FAQ](./faq#whats-up-with-the-0-7-day--range-and-2-9-day-range-what-are-they-for-why-the-difference).
2. **Create a row for the person**
    *   Type their name in any blank row in the “Person Name” column and that row will automatically turn into a “total” row for that person’s points.  All the activities you enter below this row will be a part of that person’s total. 
    *   If this profile is something that could be used "generically" regardless of location, check the "Is this a generic person profile that should be adjustable by location?" box to the left of "Person Name". Checking this box means that when you use this profile later in an activity entry you should be to adjust the score based on the location by location. Examples: A generic bodyworker, a generic hair stylist, a generic person who just gets groceries. 

    You would not check this box for a profile who represents a specific person. Example: My friend Lee lives in one specific place, so I shouldn't be adjust their score for various different locations.
3. **Activities:** Enter any activities they have done in the last 10 days the same way you would [enter your own activities](#logging-an-activity). When in doubt, it is better to overestimate. 
    *  **Note:** You do not need to include activities they have done with you, because that would lead to double counting your risk.
4. **Select this Person Risk Profile when logging an activity:** After you create a _Custom Person_, their name will automatically be available in the “Person Risk Profile” column for any activity you are entering on your own log. Just select their name from the dropdown.

See [Custom Person Modeling FAQ](./faq#custom-person-modeling) for more details.


### Examples

#### _Example 1: Seeing a friend_

**Situation:** Let’s say Alice wants to have her friend Erin over for dinner. Let’s say that Alice sends Erin her the [Risk Question page](/questions) so she can collect all the info needed to model her activities in the spreadsheet. Erin reports that she’s done the following in the last 10 days:
*   Gone grocery shopping (masked)
*   Went on a 2-hour walk with two friends (masked, not distanced, they both confirmed they don’t have symptoms now, they agreed to report symptoms in the next 10 days)
*   Rode in the car with these two friends for 15 minutes each way
*   Rode in a Lyft ride share for 15 minutes (masked, windows cracked)

Erin shared that she wears a cotton mask without a filter.

To see how you might model this situation, go to the [_Custom People_ sheet](${spreadsheetUrl}/edit#gid=311635422), then scroll to the **Example: Erin (Alice's friend)** section.

Once this is modeled, Alice can select Erin as an option on the “Person Risk Profile” column when she models having dinner together.

#### Example 2: Multiple degrees of separation away

**Situation:** Let’s say that Bob is dating Sam. Bob wants to model Sam’s activities and their housemate’s activities. Here’s what we know:
*   Sam sees their chiropractor once a week for 15 minutes. We model this person as “average” rather than “health care worker” because we know they are taking really strong screening practices. We model them the “symptoms free now” since all the staff there are taking their temperature daily. We don’t check “Will notify you if symptoms” because we’re not confident the chiropractor will notify all their patients. 
*   Sam lives with 3 other people.
    *   **Housemate 1, Toni:** Does grocery shopping on behalf of the house once a week wearing a cotton mask.
    *   **Housemate 2, Jordan:** Works in an office where they are around other people 30 hours a week total, Jordan is in the room with another person (there are 3 or 4 different people over a  week, but only one other person in the room at a time). Jordan wears a surgical mask, but we don’t know about their other people’s masks, so we assume they are cotton masks.  We know these people have minimal contact with people outside of the occasional 1-on-1 interactions, so we will model them with the “works from home” profile (even though they technically do work elsewhere). Everyone screens their symptoms as they come into work, so we check the box for “no symptoms now.”
    *   **Housemate 3, Veronica:** Works from home and isn’t socializing with anyone outside of the pod. However, we know she occassionally going to medical appointments. Since we won't likely be getting weekly detailed updates from Veronica, we want to choose a Risk Profile that overestimates her risk. We’ll represent her Risk Profile as _“Has 1 close contact whose risk profile we don't know”_ because that profile represents a lot of interaction with 1 average local person in a week (at housemate levels) and we know this is more than Veronica is doing, so it is a safe overestimate. (If we could find out Veronica's activities in a given week on average, we could instead model her as a Customer Person.)
*   **Other podmates:** There are 2 other people in Sam’s pod who also work from home and aren’t socializing with anyone outside of the pod. Again, we’ll use a “closed pod of 4 people” profile for them so we’re overestimating.
*   **Symptoms:** All of the housemates and podmates in this scenario have agreed to [report symptoms](/symptoms) within 24 hours of onset.

Note that after the initial modeling of this group of people, Bob will want to keep these models up-to-date as each person’s activities change in the last 10 days.

To see how you might model this situation, go to the [_Custom People_ sheet](${spreadsheetUrl}/edit#gid=311635422), then scroll to the **Example: Sam (Bob's partner)** section.

`

const post = { title, shortTitle, content }
export default post
