import React from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const calculator = <Link to="/calculator">calculator</Link>

/**
 * Returns a link to the spreadsheet.
 * @param text Display text for the link. Defaults to 'spreadsheet'
 */
function spreadsheet(text = 'spreadsheet') {
  return (
    <a href="https://docs.google.com/spreadsheets/d/1DYIJgjG3H5rwt52NT2TX_m429snmIU-jGw1a8ZODwGQ">
      {text}
    </a>
  )
}

export const SubscribeForm: React.FunctionComponent = () => {
  return (
    <>
      <h2>Subscribe for updates</h2>
      <p>
        We will send email updates when we make feature upgrades and bug fixes
        to the spreadsheet.
      </p>
      <p>
        <a
          href="http://eepurl.com/hb6y4T"
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
          role="button"
        >
          Sign up for spreadsheet updates →
        </a>
      </p>
    </>
  )
}

export const Spreadsheet = (): React.ReactElement => {
  return (
    <div className="paperPage">
      <h1>Spreadsheet</h1>
      <p>
        The {spreadsheet()} is a tool to help you with two things that the{' '}
        {calculator} is not quite powerful enough for:
      </p>
      <p>
        <ol>
          <li>
            The first is to{' '}
            <b>
              calculate someone's{' '}
              <Link to="/paper/6-person-risk">Person Risk</Link>
            </b>{' '}
            using the <Link to="/paper/9-advanced-method">Advanced Method</Link>{' '}
            as described in the white paper. The Advanced Method consists of
            adding up the person's risk in from their behaviors in the last 2-9
            days. The spreadsheet makes it easy to add up the activities.
          </li>
          <li>
            The second is to <b>track your own microCOVIDs</b> over a longer
            period of time. You might do this for a few reasons:
            <ul>
              <li>assessing your own risk,</li>
              <li>
                communicating with others about your risk status (e.g. by
                sending them a link to a sheet listing your recent behavior)
              </li>
              <li>
                creating agreements with others in your household (or bubble or
                pod) about how many microCOVIDs you are allowed to "spend"
                outside the household in a week or a month.
              </li>
            </ul>
          </li>
        </ol>
      </p>
      <p>
        The {spreadsheet()} includes a few multipliers that we mention in the{' '}
        <Link to="/paper/13-q-and-a">Q&A</Link> section but did not include in
        the main text or in the {calculator} for simplicity, such as better
        masks. Other than that, each row on the spreadsheet does exactly the
        same thing as the {calculator}.
      </p>

      <p>
        <strong>{spreadsheet('Use the spreadsheet here →')}</strong>
      </p>

      <SubscribeForm />

      <Alert variant="info">
        <strong>Spreadsheet version 2.0 coming soon:</strong> We are looking for
        beta testers for a new version of the spreadsheet. If you are interested
        in using the microCOVID spreadsheet with your household/pod to track
        your collective COVID risk and are willing in giving us feedback on this
        updated version, please email Jeremy at{' '}
        <a href="mailto:blanchard.jeremy@gmail.com">
          blanchard.jeremy@gmail.com
        </a>
        .
      </Alert>
    </div>
  )
}
