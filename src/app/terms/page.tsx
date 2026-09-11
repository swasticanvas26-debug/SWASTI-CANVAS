import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function TermsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const appUser = user ? { id: user.id, email: user.email!, name: user.user_metadata?.name || '', role: user.user_metadata?.role || 'customer', created_at: user.created_at } : null

  return (
    <MainLayout>
      <Navbar user={appUser} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-fade-in">
        <h1 className="font-display font-bold text-4xl text-canvas-dark mb-4">TERMS & CONDITIONS</h1>
        <p className="text-canvas-muted mb-2 font-medium">Effective Date: [11.09.2026]</p>
        <p className="text-canvas-muted mb-10 font-medium">Last Updated: [11.09.2026]</p>
        
        <div className="space-y-8 bg-white/60 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-card border border-canvas-border text-canvas-muted leading-relaxed">
          
          <div className="space-y-4">
            <p>
              These Terms & Conditions (“Terms”) govern your access to and use of the Website and the services Welcome to <strong>Swasti Canvas</strong>, an online platform for discovering, showcasing or purchasing artwork through <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a> (“Website”), provided by Swasti Canvas (“Swasti Canvas”, “we”, “us” or “our”).
            </p>
            <p>
              By accessing, registering on, purchasing from, selling through, or otherwise using the Website, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use the Website.
            </p>
            <p>
              For questions regarding these Terms, please contact us at:<br/>
              <strong>Email:</strong> <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">1. ACCEPTANCE OF TERMS</h2>
            
            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">1.1 Agreement</h3>
            <p className="mb-4">
              By visiting, registering on, browsing, purchasing artwork from, submitting artwork to, or otherwise using the Website, you acknowledge that you have read, understood and agreed to these Terms.
            </p>
            <p className="mb-4">
              These Terms should be read together with our <strong>Privacy Policy</strong>, <strong>Return & Refund Policy</strong>, <strong>Shipping Policy</strong>, and any other policies displayed on the Website.
            </p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">1.2 Additional Policies</h3>
            <p className="mb-4">
              Certain sections or services of the Website may be subject to additional terms, rules or guidelines.
            </p>
            <p className="mb-4">
              Such additional terms will form part of these Terms to the extent applicable to the relevant service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">2. MODIFICATION OF TERMS</h2>
            <p className="mb-4">
              Swasti Canvas reserves the right to modify, update, add or remove provisions of these Terms from time to time.
            </p>
            <p className="mb-4">
              Updated Terms may be published on the Website with a revised “Last Updated” date.
            </p>
            <p className="mb-4">
              Your continued use of the Website after the updated Terms are published constitutes your acceptance of the revised Terms, to the extent permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">3. ELIGIBILITY AND REGISTRATION</h2>
            
            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">3.1 Eligibility</h3>
            <p className="mb-4">
              You may use the Website only if you are legally capable of entering into a binding agreement under applicable law.
            </p>
            <p className="mb-4">
              If you are under the applicable age of majority or otherwise unable to enter into a binding contract, you may use the Website only with the involvement and supervision of a parent or legal guardian where permitted by applicable law.
            </p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">3.2 Registration</h3>
            <p className="mb-4">Certain features may require registration.</p>
            <p className="mb-4">When registering, you agree to provide information that is accurate, complete and current.</p>
            <p className="mb-4">You are responsible for updating your account information whenever necessary to keep it accurate.</p>
            <p className="mb-4">
              Swasti Canvas reserves the right to suspend, restrict or terminate an account where there is a violation of these Terms or where reasonably necessary for security, legal or operational reasons.
            </p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">3.3 Account Security</h3>
            <p className="mb-4">You are responsible for maintaining the confidentiality of your login credentials.</p>
            <p className="mb-4">You must not share your password or allow unauthorized persons to use your account.</p>
            <p className="mb-4">
              If you believe your account has been accessed without authorization, you should notify Swasti Canvas promptly at: <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">4. ROLE OF SWASTI CANVAS</h2>
            <p className="mb-4">
              Swasti Canvas provides an online platform through which artists may showcase artwork and buyers may discover and purchase artwork, subject to the applicable policies.
            </p>
            <p className="mb-4">
              Unless expressly stated otherwise, Swasti Canvas does not become the owner of artwork merely because artwork is displayed or listed on the Website.
            </p>
            <p className="mb-4">
              Where artwork is supplied by an independent artist or seller, the artist/seller remains responsible for the accuracy of information provided about the artwork and for complying with applicable laws and these Terms.
            </p>
            <p className="mb-4">
              Swasti Canvas may review, moderate or remove listings and content in accordance with these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">5. ARTIST TERMS</h2>
            
            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">5.1 Artwork Listings</h3>
            <p className="mb-2">
              Artists may submit artwork for consideration and listing on the Website, subject to Swasti Canvas's submission requirements.
            </p>
            <p className="mb-2">Artists must provide accurate information, which may include:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Artwork title;</li>
              <li>Artist name;</li>
              <li>Medium;</li>
              <li>Dimensions;</li>
              <li>Description;</li>
              <li>Price;</li>
              <li>Images;</li>
              <li>Availability; and</li>
              <li>Other information requested by Swasti Canvas.</li>
            </ul>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">5.2 Accuracy of Information</h3>
            <p className="mb-4">Artists are responsible for ensuring that all information submitted about their artwork is accurate and not misleading.</p>
            <p className="mb-4">An artist must not knowingly submit false, counterfeit, stolen or unlawfully obtained artwork.</p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">5.3 Authenticity</h3>
            <p className="mb-4">Artists represent that they have the necessary rights and authority to submit artwork for display and sale.</p>
            <p className="mb-4">Where an artwork is represented as original, the artist must ensure that such representation is accurate.</p>
            <p className="mb-4">Swasti Canvas may request additional information or documentation where reasonably necessary to verify an artwork or listing.</p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">5.4 Listing Approval</h3>
            <p className="mb-4">Submission of artwork does not guarantee that the artwork will be approved, displayed or sold.</p>
            <p className="mb-4">Swasti Canvas may reject, suspend, edit or remove an artwork listing where it considers this necessary under its policies, quality standards, legal obligations or business requirements.</p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">5.5 Sale of Listed Artwork</h3>
            <p className="mb-4">Once an order has been confirmed in accordance with the Website's purchasing process, the artist agrees to fulfil the order in accordance with the applicable Swasti Canvas policies.</p>
            <p className="mb-4">An artist must not knowingly accept an order and subsequently make the artwork unavailable without a valid reason.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">6. BUYER TERMS</h2>
            
            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">6.1 Purchasing Artwork</h3>
            <p className="mb-2">Buyers may browse available artwork and place orders through the Website according to the purchasing process provided.</p>
            <p className="mb-2">Before completing an order, buyers should carefully review:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Artwork images;</li>
              <li>Title and description;</li>
              <li>Dimensions;</li>
              <li>Medium;</li>
              <li>Price;</li>
              <li>Shipping information;</li>
              <li>Applicable taxes; and</li>
              <li>Other relevant details.</li>
            </ul>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">6.2 Order Acceptance</h3>
            <p className="mb-4">Submitting an order does not necessarily mean that the order has been finally accepted.</p>
            <p className="mb-2">Swasti Canvas may cancel or decline an order in circumstances including:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Artwork being unavailable;</li>
              <li>Incorrect pricing or listing information;</li>
              <li>Payment failure;</li>
              <li>Suspected fraud or misuse;</li>
              <li>Shipping limitations; or</li>
              <li>Other legitimate operational or legal reasons.</li>
            </ul>
            <p className="mb-4">Where an order is cancelled after payment has been received, any eligible refund will be processed in accordance with the applicable refund policy.</p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">6.3 Pricing</h3>
            <p className="mb-4">Prices displayed on the Website are those applicable at the time of purchase unless an error or other exception applies.</p>
            <p className="mb-4">Applicable taxes, shipping charges, packaging charges or other fees may be added where applicable and will be communicated during the purchase process.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">7. PAYMENTS</h2>
            <p className="mb-4">Payments must be made through the payment methods made available on the Website.</p>
            <p className="mb-4">You agree to provide accurate payment and billing information where required.</p>
            <p className="mb-4">Swasti Canvas may use third-party payment service providers to process transactions.</p>
            <p className="mb-4">Payment information may therefore be subject to the terms and privacy policies of the relevant payment service provider.</p>
            <p className="mb-4">Swasti Canvas does not knowingly retain complete payment-card information where such information is processed directly by an authorized payment service provider.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">8. SHIPPING AND DELIVERY</h2>
            <p className="mb-4">Shipping and delivery will be handled according to the applicable Shipping Policy and the information provided at the time of purchase.</p>
            <p className="mb-2">Delivery timelines may vary depending on:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Delivery location;</li>
              <li>Artwork size and type;</li>
              <li>Packaging requirements;</li>
              <li>Shipping provider;</li>
              <li>Weather or other unforeseen circumstances;</li>
              <li>Public holidays; and</li>
              <li>Other circumstances outside reasonable control.</li>
            </ul>
            <p className="mb-4">The buyer is responsible for providing a complete and accurate delivery address.</p>
            <p className="mb-4">Additional charges may apply where an order cannot be delivered because of an incorrect or incomplete address.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">9. PACKAGING AND ARTWORK CONDITION</h2>
            <p className="mb-4">Artwork must be appropriately packaged for transportation.</p>
            <p className="mb-4">Where the artist/seller is responsible for packaging, the artist/seller must take reasonable precautions to protect the artwork during shipment.</p>
            <p className="mb-4">Swasti Canvas may provide packaging or shipping instructions depending on the nature of the artwork.</p>
            <p className="mb-4">Buyers should inspect artwork promptly after delivery and report any damage or issue within the period specified in the applicable Return & Refund Policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">10. RETURNS, REFUNDS AND CANCELLATIONS</h2>
            <p className="mb-4">Returns, refunds and cancellations are governed by the applicable Return & Refund Policy and Cancellation Policy published on the Website.</p>
            <p className="mb-4">If artwork is received damaged, the buyer may be required to provide photographs, video, order details and other information necessary to assess the claim.</p>
            <p className="mb-4">Swasti Canvas may determine the appropriate resolution in accordance with the applicable policy and law.</p>
            <p className="mb-4">Certain artworks or orders may be non-returnable where expressly stated before purchase.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">11. ARTWORK DESCRIPTION AND USER CONTENT</h2>
            <p className="mb-2">Users may submit or publish content including:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Artwork images;</li>
              <li>Artist profiles;</li>
              <li>Descriptions;</li>
              <li>Photographs;</li>
              <li>Reviews;</li>
              <li>Comments; and</li>
              <li>Other information (“User Content”).</li>
            </ul>
            <p className="mb-4">Users are solely responsible for the User Content they submit.</p>
            <p className="mb-2">You must ensure that your User Content:</p>
            <ol className="list-decimal list-inside space-y-1 mb-4 ml-2">
              <li>Is accurate and not misleading;</li>
              <li>Does not infringe another person's intellectual property rights;</li>
              <li>Does not violate applicable law;</li>
              <li>Does not contain fraudulent or deceptive information;</li>
              <li>Does not contain malicious software;</li>
              <li>Does not violate another person's privacy or other legal rights; and</li>
              <li>Complies with these Terms.</li>
            </ol>
            <p className="mb-4">Swasti Canvas may remove or restrict User Content that violates these Terms or applicable law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">12. PROHIBITED ACTIVITIES</h2>
            <p className="mb-2">Users must not use the Website to:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Provide false, inaccurate or misleading information;</li>
              <li>Sell counterfeit, stolen or unlawfully obtained artwork;</li>
              <li>Infringe copyright, trademark, patent or other intellectual property rights;</li>
              <li>Violate applicable laws or regulations;</li>
              <li>Commit fraud or facilitate fraudulent transactions;</li>
              <li>Harass, threaten or abuse another person;</li>
              <li>Upload malicious software, viruses or harmful code;</li>
              <li>Attempt to gain unauthorized access to the Website;</li>
              <li>Interfere with the operation or security of the Website;</li>
              <li>Scrape, copy or reproduce Website content without authorization;</li>
              <li>Circumvent Website security measures;</li>
              <li>Use another person's account without authorization; or</li>
              <li>Engage in any activity that may harm Swasti Canvas, its users or third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">13. INTELLECTUAL PROPERTY</h2>
            
            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">13.1 Swasti Canvas Website</h3>
            <p className="mb-4">Unless otherwise stated, the Website and its contents, including its design, layout, text, graphics, logos, trademarks, photographs, software and other materials, are owned by Swasti Canvas and are protected by applicable intellectual-property laws.</p>
            <p className="mb-4">You may not copy, reproduce, modify, distribute, publish, sell or commercially exploit Website content without prior written permission.</p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">13.2 Artist Intellectual Property</h3>
            <p className="mb-4">Artists retain ownership of the intellectual property rights in their artwork unless otherwise agreed in writing.</p>
            <p className="mb-2">By submitting artwork images and related information to Swasti Canvas, the artist grants Swasti Canvas a limited, non-exclusive, royalty-free licence to use, reproduce, display and communicate that content as reasonably necessary to:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Display and promote the artwork on the Website;</li>
              <li>Market Swasti Canvas and the artist;</li>
              <li>Process and facilitate sales;</li>
              <li>Operate the Website; and</li>
              <li>Provide the services described in these Terms.</li>
            </ul>
            <p className="mb-4">This licence does not transfer ownership of the artwork or underlying copyright to Swasti Canvas.</p>

            <h3 className="text-lg font-bold text-canvas-dark mb-2 mt-4">13.3 Copyright Complaints</h3>
            <p className="mb-4">If you believe that content displayed on the Website infringes your copyright or other intellectual property rights, please contact: <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a></p>
            <p className="mb-4">Please provide sufficient information to enable us to investigate the complaint.</p>
            <p className="mb-4">Where appropriate, Swasti Canvas may remove or restrict access to allegedly infringing content while the matter is investigated.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">14. REVIEWS AND FEEDBACK</h2>
            <p className="mb-4">Where the Website allows users to submit reviews, comments or feedback, such content must be honest, relevant and lawful.</p>
            <p className="mb-4">You must not submit fake reviews, impersonate another person or attempt to manipulate ratings or reviews.</p>
            <p className="mb-4">Swasti Canvas reserves the right to remove content that violates these Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">15. THIRD-PARTY WEBSITES AND SERVICES</h2>
            <p className="mb-4">The Website may contain links to third-party websites or services.</p>
            <p className="mb-4">These third-party services are not controlled by Swasti Canvas.</p>
            <p className="mb-4">Swasti Canvas is not responsible for the content, security, privacy practices, availability or terms of third-party websites or services.</p>
            <p className="mb-4">Users should review the applicable terms and privacy policies before using third-party services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">16. WEBSITE AVAILABILITY</h2>
            <p className="mb-2">Swasti Canvas will make reasonable efforts to maintain the Website and its services. However, the Website may occasionally be unavailable because of:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Maintenance;</li>
              <li>Technical problems;</li>
              <li>Internet or network failures;</li>
              <li>Security incidents;</li>
              <li>Third-party service failures; or</li>
              <li>Circumstances beyond our reasonable control.</li>
            </ul>
            <p className="mb-4">Swasti Canvas does not guarantee that the Website will always be available, uninterrupted or error-free.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">17. CONTENT AND ARTWORK DISCLAIMER</h2>
            <p className="mb-4">While Swasti Canvas may review or moderate artwork listings, users acknowledge that artwork information is primarily provided by the relevant artist or seller.</p>
            <p className="mb-4">Swasti Canvas does not guarantee that every artwork listing will be free from errors or that every artwork will meet a user's personal expectations.</p>
            <p className="mb-4">Buyers should carefully review artwork descriptions, images, dimensions and other available information before purchasing.</p>
            <p className="mb-4">Nothing in these Terms limits any rights or remedies that cannot legally be excluded under applicable law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">18. LIMITATION OF LIABILITY</h2>
            <p className="mb-4">To the maximum extent permitted by applicable law, Swasti Canvas will not be liable for indirect, incidental, special or consequential losses arising from use of the Website or services.</p>
            <p className="mb-4">This may include loss of profits, business opportunities, data or anticipated savings, except where such limitation is prohibited by applicable law.</p>
            <p className="mb-4">Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited.</p>
            <p className="mb-4">Where Swasti Canvas acts only as a platform facilitating interaction between artists and buyers, its liability will be limited to the extent permitted by applicable law and the specific services undertaken by Swasti Canvas.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">19. INDEMNIFICATION</h2>
            <p className="mb-2">To the extent permitted by applicable law, you agree to indemnify and hold harmless Swasti Canvas, its owners, employees, representatives, service providers and affiliates from claims, losses, liabilities, damages and reasonable expenses arising from:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Your breach of these Terms;</li>
              <li>Your unlawful use of the Website;</li>
              <li>Your User Content;</li>
              <li>Your infringement of another person's rights; or</li>
              <li>Your violation of applicable law.</li>
            </ul>
            <p className="mb-4">This provision does not apply to the extent that the claim results from Swasti Canvas's own unlawful conduct or liability that cannot legally be excluded.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">20. SUSPENSION AND TERMINATION</h2>
            <p className="mb-2">Swasti Canvas may suspend or terminate access to an account or the Website where reasonably necessary, including where:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>These Terms are violated;</li>
              <li>Fraudulent or unlawful activity is suspected;</li>
              <li>Account security is compromised;</li>
              <li>False information has been provided;</li>
              <li>Intellectual property rights are infringed; or</li>
              <li>Continued access creates a legal, security or operational risk.</li>
            </ul>
            <p className="mb-4">Users may discontinue use of the Website at any time.</p>
            <p className="mb-4">Termination does not affect rights or obligations that arose before termination or provisions that by their nature should continue after termination.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">21. GOVERNING LAW AND JURISDICTION</h2>
            <p className="mb-4">These Terms shall be governed by and interpreted in accordance with the laws applicable in India.</p>
            <p className="mb-4">Any dispute arising out of or relating to these Terms or use of the Website shall be subject to the jurisdiction of the courts having appropriate jurisdiction over the matter and the applicable location of Swasti Canvas, subject to applicable law. <br/><strong>i.e. Rohtak (Haryana)</strong></p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">22. SEVERABILITY</h2>
            <p className="mb-4">If any provision of these Terms is determined to be invalid or unenforceable, that provision shall be interpreted or modified to the extent necessary to make it enforceable, where legally possible.</p>
            <p className="mb-4">The remaining provisions shall continue in full force and effect.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">23. ENTIRE AGREEMENT</h2>
            <p className="mb-4">These Terms, together with the Privacy Policy and other policies expressly incorporated into them, constitute the agreement governing your use of the Website and supersede previous communications or understandings concerning the same subject matter, to the extent permitted by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-canvas-dark mb-4 mt-8">24. CONTACT INFORMATION</h2>
            <p className="mb-4">For questions, complaints or assistance relating to these Terms or Swasti Canvas services, please contact:</p>
            <div className="bg-canvas-bg p-4 rounded-xl mb-4">
              <p className="font-bold text-canvas-dark">Swasti Canvas</p>
              <p>42, Jai Enclave Ext-III, Near Indian Bank, Delhi Road Sampla, District Rohtak, Haryana-124501</p>
              <p><strong>Website:</strong> <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a></p>
              <p><strong>Support Email:</strong> <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a></p>
            </div>
            <p className="text-sm font-medium mt-6">Last Updated: [11.09.2026]</p>
          </section>

        </div>
      </div>
    </MainLayout>
  )
}
