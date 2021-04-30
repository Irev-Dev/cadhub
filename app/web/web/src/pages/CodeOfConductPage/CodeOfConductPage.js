import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'
import OutBound from 'src/components/OutBound'
import { Link, routes } from '@redwoodjs/router'

const Li = ({ children }) => (
  <li className="pb-2 font-roboto text-lg text-gray-800">{children}</li>
)

const P = ({ children }) => <p className="py-2">{children}</p>

const CodeOfConductPage = () => {
  return (
    <MainLayout>
      <Seo
        title={'Code Of Conduct'}
        description="Outlines CadHub's policy in regards to Code of Conduct"
        lang="en-US"
      />
      <div className="max-w-5xl mx-auto mt-20">
        <h1 className="text-3xl">Code of Conduct</h1>
        <h2 className="text-2xl font-ropa-sans py-4">What's Required</h2>
        <ul className="list-disc pl-4">
          <Li>
            We are committed to providing a friendly, safe and welcoming
            environment for all, regardless of any morally irrelevant attributes
            (level of experience, gender identity and expression, sexual
            orientation, disability, personal appearance, body size, race,
            ethnicity, age, religion, nationality, or other similar
            characteristic).
          </Li>
          <Li>
            Please avoid using overtly sexual parts, title, usernames or other
            user-creatable content that might detract from a friendly, safe and
            welcoming environment for all.
          </Li>
          <Li>
            Please be kind and courteous. There’s no need to be mean or rude.
          </Li>
          <Li>
            Respect that people have differences of opinion and that every
            design or implementation choice carries a trade-off and numerous
            costs. There is seldom a right answer.
          </Li>
          <Li>Please keep unstructured critique to a minimum.</Li>
          <Li>
            We will exclude you from interaction if you insult, demean or harass
            anyone. That is not welcome behavior. We interpret the term
            “harassment” as including the definition in the{' '}
            <OutBound
              className="text-gray-600 underline"
              to="https://github.com/stumpsyn/policies/blob/master/citizen_code_of_conduct.md"
            >
              Citizen Code of Conduct
            </OutBound>
            ; if you have any lack of clarity about what might be included in
            that concept, please read their definition.
          </Li>
          <Li>
            Private harassment is also unacceptable. No matter who you are, if
            you feel you have been or are being harassed or made uncomfortable
            by a community member, please contact the{' '}
            <a
              className="text-gray-600 underline"
              href="mailto:moderation@kurthutten.com"
            >
              CadHub moderation team
            </a>{' '}
            immediately. We care about making this community a safe place for
            you and we’ve got your back.
          </Li>
          <Li>
            Likewise any spamming, trolling, flaming, baiting or other
            attention-stealing behavior is not welcome.
          </Li>
        </ul>

        <h2 className="text-2xl font-ropa-sans py-4">Moderation</h2>
        <div className="font-roboto text-lg text-gray-800">
          <P>
            These are the policies for upholding our community’s standards of
            conduct.
          </P>
          <ol className="list-decimal pl-6">
            <Li>
              Remarks that violate the CadHub standards of conduct, including
              hateful, hurtful, oppressive, or exclusionary remarks, are not
              allowed. (Cursing is allowed, but never targeting another user,
              and never in a hateful manner.)
            </Li>
            <Li>
              Remarks that moderators find inappropriate, whether listed in the
              code of conduct or not, are also not allowed.
            </Li>
            <Li>
              Moderators will first respond to such remarks with a warning.
            </Li>
            <Li>
              If the warning is unheeded, the user will be “kicked,” i.e.,
              kicked out of the communication channel to cool off.
            </Li>
            <Li>
              If the user comes back and continues to make trouble, they will be
              banned, i.e., indefinitely excluded.
            </Li>
            <Li>
              Moderators may choose at their discretion to un-ban the user if it
              was a first offense and they offer the offended party a genuine
              apology.
            </Li>
            <Li>
              If a moderator bans someone and you think it was unjustified,
              please take it up with that moderator, or with a different
              moderator, <strong>in private</strong>. Complaints about bans
              in-channel are not allowed.
            </Li>
            <Li>
              Moderators are held to a higher standard than other community
              members. If a moderator creates an inappropriate situation, they
              should expect less leeway than others.
            </Li>
          </ol>
          <P>
            In the CadHub community we strive to go the extra step to look out
            for each other. Don’t just aim to be technically unimpeachable, try
            to be your best self. In particular, avoid flirting with offensive
            or sensitive issues, particularly if they’re off-topic; this all too
            often leads to unnecessary fights, hurt feelings, and damaged trust;
            worse, it can drive people away from the community entirely.
          </P>
          <P>
            And if someone takes issue with something you said or did, resist
            the urge to be defensive. Just stop doing what it was they
            complained about and apologize. Even if you feel you were
            misinterpreted or unfairly accused, chances are good there was
            something you could’ve communicated better. Everyone wants to get
            along and we are all here first and foremost because we want to talk
            about cool technology. You will find that people will be eager to
            assume good intent and forgive as long as you earn their trust.
          </P>
          <P>
            The enforcement policies listed above apply to all official CadHub
            venues; including{' '}
            <OutBound
              className="text-gray-600 underline"
              to="https://discord.gg/SD7zFRNjGH"
            >
              Discord channels
            </OutBound>
            ,{' '}
            <OutBound
              className="text-gray-600 underline"
              to="https://github.com/Irev-Dev/cadhub"
            >
              GitHub
            </OutBound>{' '}
            and{' '}
            <Link className="text-gray-600 underline" to={routes.home()}>
              CadHub
            </Link>
            . Please contact the maintainers of those projects for enforcement.
            If you wish to use this code of conduct for your own project,
            consider explicitly mentioning your moderation policy or making a
            copy with your own moderation policy so as to avoid confusion.
          </P>
          <P>
            <i>
              Adapted from{' '}
              <OutBound
                className="text-gray-600 underline"
                to="http://blog.izs.me/post/30036893703/policy-on-trolling"
              >
                Node.js Policy on Trolling
              </OutBound>
              ,{' '}
              <OutBound
                className="text-gray-600 underline"
                to="https://www.contributor-covenant.org/version/1/3/0/"
              >
                Contributor Covenant v1.3.0
              </OutBound>{' '}
              and{' '}
              <OutBound
                className="text-gray-600 underline"
                to="https://www.rust-lang.org/policies/code-of-conduct"
              >
                Rust Code of Conduct
              </OutBound>
              .
            </i>
          </P>
        </div>
      </div>
    </MainLayout>
  )
}

export default CodeOfConductPage
