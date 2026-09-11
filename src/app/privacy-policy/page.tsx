import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function PrivacyPolicyPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const appUser = user ? { id: user.id, email: user.email!, name: user.user_metadata?.name || '', role: user.user_metadata?.role || 'customer' } : null

  return (
    <MainLayout>
      <Navbar user={appUser} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-fade-in">
        <h1 className="font-display font-bold text-4xl text-canvas-dark mb-4">PRIVACY POLICY</h1>
        <p className="text-canvas-muted mb-10 font-medium">Effective Date: [11.09.2026]</p>
        
        <div className="space-y-8 bg-white/60 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-card border border-canvas-border text-canvas-muted leading-relaxed">
          
          <div className="space-y-4">
            <p>
              Swasti Canvas (“Swasti Canvas”, “we”, “us” or “our”) is committed to protecting the privacy and personal information of users who visit or use our website <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a> (“Website”).
            </p>
            <p>
              This Privacy Policy explains how we collect, use, store, protect and disclose information provided by users while using our Website and services.
            </p>
            <p>
              By accessing or using the Website, you acknowledge that you have read and understood this Privacy Policy and consent to the collection and use of information as described below.
            </p>
            <p>
              This Privacy Policy should be read together with our Terms & Conditions, Return & Refund Policy, and other applicable policies available on the Website.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">1. GENERAL</h2>
            
            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">1.1 Acceptance of this Privacy Policy</h3>
            <p className="mb-4">
              Your use of <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a> constitutes your acceptance of this Privacy Policy and the practices described herein.
            </p>
            <p className="mb-4">
              If you do not agree with this Privacy Policy, please do not use the Website or provide personal information to us.
            </p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">1.2 Commitment to Privacy</h3>
            <p className="mb-4">
              Swasti Canvas respects the privacy of its users and is committed to safeguarding personal information while providing a secure and useful online experience.
            </p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">1.3 Information Security</h3>
            <p className="mb-4">
              We take reasonable measures to protect personal information against unauthorized access, misuse, alteration, disclosure or destruction.
            </p>
            <p className="mb-4">
              However, users should understand that transmission of information over the Internet cannot be guaranteed to be completely secure. While we make reasonable efforts to protect information, we cannot guarantee absolute security of information transmitted through the Website.
            </p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">1.4 Relationship with Other Policies</h3>
            <p className="mb-4">
              This Privacy Policy forms part of the terms governing your use of the Website and should be read together with our Terms & Conditions and other applicable policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">2. INFORMATION WE COLLECT</h2>
            
            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">2.1 Traffic and Technical Information</h3>
            <p className="mb-2">
              When you visit or use our Website, certain technical information may automatically be collected, which may include:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>IP address;</li>
              <li>Browser type and version;</li>
              <li>Device information;</li>
              <li>Operating system;</li>
              <li>Domain/server information;</li>
              <li>Pages visited;</li>
              <li>Date and time of access;</li>
              <li>Website usage and interaction information; and</li>
              <li>Other technical information associated with your interaction with the Website.</li>
            </ul>
            <p className="mb-4">
              Such information may be used to operate, maintain, secure and improve the Website.
            </p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">2.2 Personal Information</h3>
            <p className="mb-2">
              Depending on the services or features you use, we may collect information that identifies or may reasonably be associated with you.
            </p>
            <p className="mb-2">This may include:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Name;</li>
              <li>Email address;</li>
              <li>Telephone/mobile number;</li>
              <li>Billing or shipping address;</li>
              <li>Account/login information;</li>
              <li>Artist profile information;</li>
              <li>Artwork-related information;</li>
              <li>Order and transaction information;</li>
              <li>Communications sent to us; and</li>
              <li>Other information that you voluntarily provide to us.</li>
            </ul>
            <p className="mb-4">
              We only request information that is reasonably necessary for providing our services and operating the Website.
            </p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">2.3 Information Provided Through Communication</h3>
            <p className="mb-4">
              If you contact Swasti Canvas by email, telephone, contact form or other communication method, we may retain the information contained in that communication for the purpose of responding to your enquiry, providing support, maintaining records and improving our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">3. USE OF INFORMATION</h2>
            <p className="mb-2">Swasti Canvas may use collected information for purposes including:</p>
            <ol className="list-decimal list-inside space-y-1 mb-4 ml-2">
              <li>Creating and managing user accounts;</li>
              <li>Providing access to our services;</li>
              <li>Processing artwork submissions and listings;</li>
              <li>Processing and fulfilling orders;</li>
              <li>Communicating with artists and buyers;</li>
              <li>Providing customer support;</li>
              <li>Processing payments and related transactions through applicable service providers;</li>
              <li>Shipping and delivery of purchased artwork;</li>
              <li>Improving our Website, services and user experience;</li>
              <li>Preventing fraud, misuse and unauthorized activity;</li>
              <li>Maintaining Website security;</li>
              <li>Conducting internal analysis and business operations;</li>
              <li>Sending service-related communications;</li>
              <li>Sending promotional communications where permitted and/or where the user has provided appropriate consent; and</li>
              <li>Complying with applicable legal and regulatory requirements.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">4. COOKIES AND SIMILAR TECHNOLOGIES</h2>
            <p className="mb-4">Swasti Canvas may use cookies and similar technologies on certain pages of the Website.</p>
            <p className="mb-2">Cookies are small data files stored on a user's device that may help us:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Maintain user sessions;</li>
              <li>Remember preferences;</li>
              <li>Improve Website functionality;</li>
              <li>Understand Website usage;</li>
              <li>Analyse traffic and performance;</li>
              <li>Improve security; and</li>
              <li>Measure the effectiveness of promotional activities.</li>
            </ul>
            <p className="mb-4">
              Some cookies may be temporary and may be deleted when you close your browser.
            </p>
            <p className="mb-4">
              You may be able to control or disable cookies through your browser settings. However, disabling certain cookies may affect the availability or functionality of some features of the Website.
            </p>
            <p className="mb-4">
              Third-party services used on the Website may also use their own cookies or similar technologies. Their use of such technologies will be governed by their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">5. DISCLOSURE OF PERSONAL INFORMATION</h2>
            <p className="mb-4">Swasti Canvas does not sell or rent users' personal information to third parties.</p>
            <p className="mb-4">However, personal information may be shared where reasonably necessary for operating our business and providing our services.</p>
            <p className="mb-2">This may include sharing information with:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Employees and authorized personnel;</li>
              <li>Service providers and business partners;</li>
              <li>Payment processing providers;</li>
              <li>Shipping and logistics providers;</li>
              <li>Website hosting and technology providers;</li>
              <li>Professional advisers and consultants;</li>
              <li>Legal or regulatory authorities where required; and</li>
              <li>Other parties where disclosure is necessary to provide a service requested by the user.</li>
            </ul>
            <p className="mb-4">
              We seek to ensure that information shared with service providers is handled appropriately and for legitimate purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">6. AGGREGATED AND NON-PERSONAL INFORMATION</h2>
            <p className="mb-4">
              Swasti Canvas may use information in aggregated or anonymized form so that individual users are not identified.
            </p>
            <p className="mb-2">Such information may be used for purposes including:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Website analytics;</li>
              <li>Understanding user preferences;</li>
              <li>Improving Website functionality;</li>
              <li>Business planning;</li>
              <li>Service improvement;</li>
              <li>Marketing analysis; and</li>
              <li>Measuring Website performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">7. LEGAL DISCLOSURE</h2>
            <p className="mb-2">
              Swasti Canvas may disclose personal information where we reasonably believe that such disclosure is necessary to:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Comply with applicable law, regulation, court order or legal process;</li>
              <li>Protect the rights, property or safety of Swasti Canvas;</li>
              <li>Protect the rights, property or safety of our users or other persons;</li>
              <li>Investigate fraud, misuse or security incidents;</li>
              <li>Enforce our Terms & Conditions or other agreements; or</li>
              <li>Respond to a lawful request from a competent authority.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">8. CONFIDENTIALITY AND SECURITY</h2>
            <p className="mb-4">
              We take reasonable steps to maintain the confidentiality and security of personal information.
            </p>
            <p className="mb-4">
              We may use appropriate technical and organizational measures to protect information from unauthorized access, alteration, disclosure or destruction.
            </p>
            <p className="mb-4">
              However, no Internet-based system can be guaranteed to be completely secure.
            </p>
            <p className="mb-4">
              Users should therefore exercise appropriate care when sharing information online and should keep their account credentials confidential.
            </p>
            <p className="mb-4">
              If we become aware of a security incident affecting personal information, we will take reasonable steps to investigate and respond to the incident and provide notifications where required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">9. THIRD-PARTY WEBSITES AND SERVICES</h2>
            <p className="mb-4">
              The Website may contain links to third-party websites, applications, payment services, shipping services or other external platforms.
            </p>
            <p className="mb-4">
              Swasti Canvas does not control the privacy practices of such third parties.
            </p>
            <p className="mb-4">
              Once you leave the Swasti Canvas Website or interact with a third-party service, your information may be governed by that third party's privacy policy and terms.
            </p>
            <p className="mb-4">
              We recommend that users review the privacy policies of third-party websites and services before providing personal information to them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">10. CHILDREN'S PRIVACY</h2>
            <p className="mb-4">
              Our Website and services are not intentionally designed to collect personal information from children.
            </p>
            <p className="mb-4">
              If we become aware that personal information has been collected from a child in circumstances where such collection is not permitted by applicable law, we will take reasonable steps to address the situation in accordance with applicable legal requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">11. DATA RETENTION</h2>
            <p className="mb-2">Swasti Canvas may retain personal information for as long as reasonably necessary to:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Provide our services;</li>
              <li>Maintain user and transaction records;</li>
              <li>Comply with legal and regulatory obligations;</li>
              <li>Resolve disputes;</li>
              <li>Enforce agreements; and</li>
              <li>Protect our legitimate business interests.</li>
            </ul>
            <p className="mb-4">
              The applicable retention period may vary depending on the type of information and the purpose for which it was collected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">12. USER RIGHTS</h2>
            <p className="mb-2">
              Subject to applicable law, users may have rights relating to their personal information, which may include the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Request access to personal information held by us;</li>
              <li>Request correction of inaccurate or incomplete information;</li>
              <li>Request deletion of personal information where legally applicable;</li>
              <li>Withdraw consent where processing is based on consent;</li>
              <li>Raise concerns regarding the handling of personal information; and</li>
              <li>Exercise other rights available under applicable law.</li>
            </ul>
            <p className="mb-4">
              Requests relating to personal information may be sent to:<br/>
              <strong>Email:</strong> <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>
            </p>
            <p className="mb-4">
              We may need to verify a request before taking action, where reasonably necessary to protect the security and privacy of users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">13. MARKETING COMMUNICATIONS</h2>
            <p className="mb-4">
              Where permitted by applicable law, Swasti Canvas may send users information about new artwork, services, offers, updates or other promotional communications.
            </p>
            <p className="mb-4">
              Users may request to stop receiving promotional communications by following the unsubscribe instructions included in such communications or by contacting us at: <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>
            </p>
            <p className="mb-4">
              Service-related communications, such as order confirmations, account notifications and important Website updates, may still be sent where necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">14. CHANGES TO THIS PRIVACY POLICY</h2>
            <p className="mb-4">
              Swasti Canvas may update, modify or amend this Privacy Policy from time to time.
            </p>
            <p className="mb-4">
              Any updated version may be published on this page with a revised <strong>Effective Date</strong>.
            </p>
            <p className="mb-4">
              Users are encouraged to review this Privacy Policy periodically to remain informed about how their information is handled.
            </p>
            <p className="mb-4">
              Your continued use of the Website after an updated Privacy Policy becomes effective may constitute acceptance of the revised policy, to the extent permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">15. LIMITATION OF LIABILITY</h2>
            <p className="mb-4">
              While Swasti Canvas takes reasonable measures to protect personal information, we do not guarantee that the Website or transmission of information over the Internet will always be completely secure, uninterrupted or free from unauthorized access.
            </p>
            <p className="mb-4">
              To the maximum extent permitted by applicable law, Swasti Canvas shall not be responsible for security incidents arising solely from circumstances beyond our reasonable control, including unauthorized acts of third parties or failures of external networks and services.
            </p>
            <p className="mb-4">
              Nothing in this Privacy Policy is intended to exclude or limit any liability that cannot lawfully be excluded or limited under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">16. CONTACT US</h2>
            <p className="mb-4">
              If you have any questions, concerns, requests or complaints regarding this Privacy Policy or the handling of your personal information, please contact us.
            </p>
            <div className="bg-canvas-bg p-4 rounded-xl mb-4">
              <p className="font-bold text-canvas-dark">Swasti Canvas</p>
              <p>42, Jai Enclave Ext-III, Near Indian Bank, Delhi Road Sampla, District Rohtak, Haryana-124501</p>
              <p><strong>Website:</strong> <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a></p>
              <p><strong>Support Email:</strong> <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a></p>
            </div>
            <p className="mb-4">
              We will make reasonable efforts to review and respond to privacy-related enquiries in accordance with applicable law.
            </p>
          </section>

        </div>
      </div>
    </MainLayout>
  )
}
