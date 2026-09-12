import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function FAQPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const appUser = user ? { id: user.id, email: user.email!, name: user.user_metadata?.name || '', role: user.user_metadata?.role || 'customer', created_at: user.created_at } : null

  return (
    <MainLayout>
      <Navbar user={appUser} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-fade-in">
        <h1 className="font-display font-bold text-4xl text-canvas-dark mb-4">Frequently Asked Questions (FAQ)</h1>
        <p className="text-canvas-muted mb-10">Find answers to the most common questions about Swasti Canvas.</p>
        
        <div className="space-y-8 bg-white/60 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-card border border-canvas-border">
          
          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">1. How do I join Swasti Canvas as an artist or buyer?</h2>
            <p className="text-canvas-muted leading-relaxed">
              You can register online through our website, <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a>. After completing the registration process and accepting our Terms & Conditions, you will become a registered user of Swasti Canvas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">2. Why should I join Swasti Canvas as an artist?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Swasti Canvas provides artists with an opportunity to showcase their artwork to art lovers, collectors and potential buyers. Our platform aims to promote artists and provide them with greater visibility for their creative work.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              Artists can showcase their work online and benefit from promotional and marketing opportunities offered through Swasti Canvas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">3. What is the best format for uploading artwork images?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              For the best uploading experience, please follow these guidelines:
            </p>
            <ul className="list-disc list-inside text-canvas-muted space-y-1">
              <li>Accepted formats: <strong>JPG, JPEG or PNG</strong></li>
              <li>Maximum resolution: <strong>300 DPI</strong></li>
              <li>Recommended image size: <strong>Less than 3 MB</strong></li>
              <li>Please use clear, good-quality photographs of your artwork.</li>
              <li>Avoid using special characters in the artwork file name.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">4. How can I check the size of my artwork image?</h2>
            <p className="text-canvas-muted leading-relaxed mb-2">On a computer:</p>
            <ol className="list-decimal list-inside text-canvas-muted space-y-1 mb-3 ml-2">
              <li>Right-click on the artwork image.</li>
              <li>Select <strong>Properties</strong>.</li>
              <li>Check the image's file size, dimensions and other details.</li>
            </ol>
            <p className="text-canvas-muted leading-relaxed">
              We recommend keeping artwork images within the size limit specified by Swasti Canvas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">5. How can I reduce the size of an artwork image?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              You can reduce an image size using image-editing or image-compression software.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              You may resize or compress the image while maintaining sufficient quality so that the artwork remains clear and suitable for viewing online.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">6. How can an artist register with Swasti Canvas?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">To register as an artist:</p>
            <ol className="list-decimal list-inside text-canvas-muted space-y-1 mb-3 ml-2">
              <li>Visit <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a>.</li>
              <li>Click on <strong>Register / Sign Up</strong> as Customer through Google account.</li>
              <li>Complete the registration form with the required information.</li>
              <li>Read and accept the Terms & Conditions.</li>
              <li>Submit the registration form.</li>
              <li>After successful registration, complete your artist profile.</li>
              <li>Upload your profile photograph and other requested information.</li>
              <li>Save your profile information.</li>
            </ol>
            <p className="text-canvas-muted leading-relaxed">
              Your artist profile may be visible to visitors and potential buyers on the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">7. How do I sign in to Swasti Canvas?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">If you are already registered:</p>
            <ol className="list-decimal list-inside text-canvas-muted space-y-1 mb-3 ml-2">
              <li>Visit <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a>.</li>
              <li>Click <strong>Sign In / Login</strong>.</li>
              <li>Enter your registered email address and password.</li>
              <li>Click <strong>Login</strong>.</li>
            </ol>
            <p className="text-canvas-muted leading-relaxed">
              If you are not yet registered, please complete the registration process first.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">8. What should I do if I forget my password?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Click on <strong>Forgot Password</strong> on the login page and enter your registered Google email address.
            </p>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Follow the instructions provided by Swasti Canvas to reset your password.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              If you face any difficulty, contact our support team at: <br/>
              <strong>Email:</strong> <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">9. How can an artist upload artwork to Swasti Canvas?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">After registering as an artist:</p>
            <ol className="list-decimal list-inside text-canvas-muted space-y-1 mb-3 ml-2">
              <li>Sign in to your account.</li>
              <li>Go to your artist/customer dashboard.</li>
              <li>Select the option to <strong>Add / Submit Artwork</strong> link.</li>
              <li>Enter the required artwork details.</li>
              <li>Upload a valid link of your artwork.</li>
              <li>Review the information carefully.</li>
              <li>Submit for review.</li>
            </ol>
            <p className="text-canvas-muted leading-relaxed italic text-sm">
              Please ensure that Artwork is your original or you have the copyright of the Artwork and all artwork information is accurate before submission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">10. What information is required when uploading artwork?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Depending on the requirements of Swasti Canvas, artists may be asked to provide:
            </p>
            <ul className="list-disc list-inside text-canvas-muted space-y-1 mb-3 ml-2">
              <li>Artwork title</li>
              <li>Medium / type of artwork</li>
              <li>Dimensions</li>
              <li>Colour</li>
              <li>Description</li>
              <li>Price</li>
              <li>Artwork image</li>
              <li>Other relevant artwork details</li>
            </ul>
            <p className="text-canvas-muted leading-relaxed">
              Please provide accurate information so buyers can understand the artwork properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">11. Can I update my artwork after uploading it?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Yes, but through Admin only. Artist can send an email to the Swasti Canvas for any changes/updates
            </p>
            <p className="text-canvas-muted leading-relaxed">
              For any update, please contact us at <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">12. What does it cost to create an artist account?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Initially, there is no fee for Artist registration and account-related charges are subject to the future Swasti Canvas policies.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              Please refer to the applicable information displayed on <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a> or contact us at <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a> for the latest details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">13. What are the rules for selling artwork online?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Artists are responsible for ensuring that the artwork and information submitted by them are genuine, accurate and comply with the Terms & Conditions of Swasti Canvas.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              Artists should carefully read the Terms & Conditions before submitting artwork for sale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">14. Is Swasti Canvas available only in India?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Swasti Canvas may accept artists and buyers from different locations, subject to applicable website policies, payment facilities, shipping availability and legal requirements.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              For enquiries regarding international orders or participation, please contact:<br/>
              <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">15. How does shipping of artwork work?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Shipping arrangements depend on the artwork, destination, order and applicable Swasti Canvas shipping policy.
            </p>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Before completing a purchase, buyers should check the applicable shipping charges, delivery timelines and shipping conditions.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              For shipping-related questions, please contact <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">16. What is Swasti Canvas's return and refund policy?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Returns and refunds are subject to the applicable Swasti Canvas Return & Refund Policy.
            </p>
            <p className="text-canvas-muted leading-relaxed mb-3">
              If an artwork arrives damaged or there is another issue with your order, please contact us as soon as possible and provide the relevant order details and photographs, where required.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              <strong>Support Email:</strong> <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">17. How many artworks can an artist display on the website?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              The number of artworks an artist may upload or display is subject to the current Swasti Canvas website policy.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              Please check your artist dashboard or contact our support team for the applicable limit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">18. What can I expect from Swasti Canvas?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Swasti Canvas aims to provide an easy and reliable platform for discovering, showcasing and purchasing artwork.
            </p>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Artists can use the platform to present their creative work, while buyers can explore artwork and connect with artists through the platform.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              We believe in supporting artists and encouraging appreciation and purchase of authentic artwork.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">19. How are artwork prices determined?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Artists may determine the selling price of their artwork in accordance with Swasti Canvas's pricing guidelines and Terms & Conditions.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              Any applicable pricing requirements, commissions, taxes or other charges will be communicated according to the current Swasti Canvas policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">20. What types of art and mediums are accepted?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Swasti Canvas may showcase different forms of artwork, subject to its submission and quality guidelines.
            </p>
            <p className="text-canvas-muted leading-relaxed mb-3">
              These may include:
            </p>
            <ul className="list-disc list-inside text-canvas-muted space-y-1 mb-3 ml-2">
              <li>Paintings</li>
              <li>Works on paper</li>
              <li>Photography</li>
              <li>Prints</li>
              <li>Sculpture</li>
              <li>Mixed media</li>
              <li>Other forms of visual art</li>
            </ul>
            <p className="text-canvas-muted leading-relaxed">
              Artists should check the current submission guidelines before uploading their work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">21. Does Swasti Canvas charge a commission on artwork sold?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Any applicable commission or platform charges are governed by the current Swasti Canvas commercial policy.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              For the latest commission structure, artists should check the relevant information on <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a> or contact <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">22. Are taxes applicable to artwork purchases?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Applicable taxes, including GST where required by law, may be added to the final invoice depending on the nature of the transaction and applicable regulations.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              The applicable tax amount will be communicated to the buyer at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">23. Will my artwork be stretched and framed before delivery?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              Framing and stretching arrangements depend on the particular artwork and order.
            </p>
            <p className="text-canvas-muted leading-relaxed mb-3">
              If an artwork is supplied unframed or upstretched, the applicable product description will indicate this wherever relevant. Any additional framing or stretching charges, if available, may be borne by the buyer.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              Please check the artwork details before placing an order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">24. Can international buyers purchase artwork from Swasti Canvas?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              International purchases are subject to payment facilities, shipping availability, customs requirements and applicable laws.
            </p>
            <p className="text-canvas-muted leading-relaxed mb-3">
              International shipping charges, taxes or customs duties, where applicable, may be additional.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              For international purchase enquiries, please contact:<br/>
              <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-canvas-dark mb-2">25. How can I contact Swasti Canvas for support?</h2>
            <p className="text-canvas-muted leading-relaxed mb-3">
              For questions regarding registration, artwork uploads, purchases, payments, shipping, returns or any other website-related issue, please contact our support team.
            </p>
            <p className="text-canvas-muted leading-relaxed">
              <strong>Website:</strong> <a href="/" className="text-teal hover:underline">www.swasticanvas.com</a><br/>
              <strong>Support Email:</strong> <a href="mailto:swasticanvas26@gmail.com" className="text-teal hover:underline">swasticanvas26@gmail.com</a>
            </p>
            <p className="text-canvas-muted leading-relaxed mt-4">
              We will be happy to assist you.
            </p>
          </section>

        </div>
      </div>
    </MainLayout>
  )
}
