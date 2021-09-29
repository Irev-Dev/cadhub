import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'
import OutBound from 'src/components/OutBound'

const Li = ({ children }) => (
  <li className="pb-2 font-roboto text-lg text-gray-800">{children}</li>
)

const P = ({ children }) => <p className="py-2">{children}</p>

const A = ({ to }) => <OutBound to={to}>{to}</OutBound>

const SubHeading = ({ children }) => <h3>{children}</h3>

const PrivacyPolicyPage = () => {
  return (
    <MainLayout>
      <Seo
        title={'Privacy Policy'}
        description="Outlines CadHub's policy in regards to User's right to privacy"
        lang="en-US"
      />
      <div className="max-w-5xl mx-auto mt-20">
        <h1 className="text-3xl">CadHub Privacy Policy</h1>
        <P>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit or use{' '}
          <A to="https://cadhub.xyz" /> {'(the “Site”)'}.
        </P>
        <SubHeading>PERSONAL INFORMATION WE COLLECT</SubHeading>
        <P>
          When you visit the Site, we automatically collect certain information
          about your device, including information about your web browser, IP
          address, time zone, and some of the cookies that are installed on your
          device. Additionally, as you browse the Site, we collect information
          about the individual web pages that you view, what websites or search
          terms referred you to the Site, and information about how you interact
          with the Site. We refer to this automatically-collected information as
          {'“Device Information.”'}
        </P>
        <P>We collect Device Information using the following technologies:</P>
        <ul className="list-disc pl-4">
          <Li>
            “Cookies” are data files that are placed on your device or computer
            and often include an anonymous unique identifier. For more
            information about cookies, and how to disable cookies, visit
            <A to="http://www.allaboutcookies.org" />.
          </Li>
          <Li>
            “Log files” track actions occurring on the Site, and collect data
            including your IP address, browser type, Internet service provider,
            referring/exit pages, and date/time stamps.
          </Li>
          <Li>
            “Web beacons,” “tags,” and “pixels” are electronic files used to
            record information about how you browse the Site.
          </Li>
        </ul>
        <P>
          Additionally when you make an account or sign in to the app through
          the Site, we collect certain information from you, including your
          name, email address as well as any information you add to the website,
          such as your profile bio, or {'"Projects"'} you have added. We refer
          to this information as “Account Information.”
        </P>
        <P>
          When we talk about “Personal Information” in this Privacy Policy, we
          are talking both about Device Information and Account Information.
        </P>
        <SubHeading>HOW DO WE USE YOUR PERSONAL INFORMATION?</SubHeading>
        <P>
          We use the Account Information that we collect generally to link you
          to your account and the content you create through CadHub.xyz.
          Additionally, we use this Account Information to communicate with you.
          We use the Device Information that we collect to help us screen for
          potential risk (in particular, your IP address), and more generally to
          improve and optimize our Site (for example, by generating analytics
          about how our customers browse and interact with the Site, and to
          assess the success of our marketing and advertising campaigns).
        </P>
        <SubHeading>SHARING YOUR PERSONAL INFORMATION</SubHeading>
        <P>
          We share your Personal Information with third parties to help us use
          your Personal Information, as described above. For example, we use
          Netlify's idenity service to handle user logins and authentication --
          you can read more about how Netlify uses your Personal Information
          here: <A to="https://www.netlify.com/privacy/" /> --{' '}
          <A to="https://www.netlify.com/gdpr-ccpa" />. We also use Google
          Analytics to help us understand how our customers use the Site -- you
          can read more about how Google uses your Personal Information here:{' '}
          <A to="https://www.google.com/intl/en/policies/privacy/" />. You can
          also opt-out of Google Analytics here:{' '}
          <A to="https://tools.google.com/dlpage/gaoptout" />. We also use
          MailChimp to send newsletters, You can read more about how MailChip
          uses your Personal Information here:{' '}
          <A to="https://mailchimp.com/legal/privacy/" />.
        </P>
        <P>
          Finally, we may also share your Personal Information to comply with
          applicable laws and regulations, to respond to a subpoena, search
          warrant or other lawful request for information we receive, or to
          otherwise protect our rights.
        </P>

        <SubHeading>DO NOT TRACK</SubHeading>
        <P>
          Please note that we do not alter our Site’s data collection and use
          practices when we see a Do Not Track signal from your browser.
        </P>
        <SubHeading>YOUR RIGHTS</SubHeading>
        <P>
          If you are a European resident, you have the right to access personal
          information we hold about you and to ask that your personal
          information be corrected, updated, or deleted. If you would like to
          exercise this right, please contact us through the contact information
          below.
        </P>
        <P>
          Additionally, if you are a European resident we note that we are
          processing your information in order to fulfill contracts we might
          have with you (for example if you make an order through the Site), or
          otherwise to pursue our legitimate business interests listed above.
          Additionally, please note that your information will be transferred
          outside of Europe, including to Australia, Canada and the United
          States.
        </P>
        <SubHeading>DATA RETENTION</SubHeading>
        <P>
          When you place an create a {'"project"'} through the Site, we will
          keep this record to become part of the public website, you can delete
          you Projects at anytime.
        </P>
        <SubHeading>CHANGES</SubHeading>
        <P>
          We may update this privacy policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal or regulatory reasons.
        </P>
        <SubHeading>CONTACT US</SubHeading>
        <P>
          For more information about our privacy practices, if you have
          questions, or if you would like to make a complaint, please contact us
          by e-mail at{' '}
          <a href="mailto:privacy@kurthutten.com">privacy@kurthutten.com</a> or
          by mail using the details provided below:
        </P>
        <P>PO Box 462, Figtree, NSW, 2525, Australia</P>
      </div>
    </MainLayout>
  )
}

export default PrivacyPolicyPage
