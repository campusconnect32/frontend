export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-[#E7E5E0] rounded-2xl p-8 space-y-6">
        <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
        <p className="text-sm text-[#6B6B70]">Effective date: May 2026</p>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">1. Information we collect</h2>
          <p className="text-sm text-[#404040] leading-relaxed">
            When you create an account, we collect your email address, name, profile picture,
            date of birth, gender, health status, location data (GPS), and the information you
            provide in your profile (bio, interests, preferences, photos). We also record your
            activity on the platform, such as swipes, matches, messages, and story posts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">2. How we use your data</h2>
          <ul className="list-disc list-inside text-sm text-[#404040] space-y-1">
            <li>To provide the dating and social networking features of Haven.</li>
            <li>To show you relevant profiles based on your preferences and location.</li>
            <li>To send you notifications about matches, messages, and requests.</li>
            <li>To improve our service and troubleshoot issues.</li>
            <li>
              To display advertisements (you may see ads, but your personal data is not shared
              with advertisers).
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">3. Data sharing</h2>
          <p className="text-sm text-[#404040] leading-relaxed">
            We do <strong>not</strong> sell, trade, or share your personal information with third
            parties. Your data stays in our secure database. Advertisements shown on Haven come
            from ad networks, but these networks do not receive your name, email, or profile
            information. You may see ads based on contextual placement only.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">4. Data storage & security</h2>
          <p className="text-sm text-[#404040] leading-relaxed">
            Your data is stored on secure servers managed by Supabase. We use encryption in
            transit (HTTPS) and at rest. Access to personal data is restricted to essential
            personnel and is only used for the purposes stated above.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">5. Your rights</h2>
          <p className="text-sm text-[#404040] leading-relaxed">
            You can access, update, or delete your data at any time through your profile settings.
            If you delete your account, all personal information is anonymised or removed from our
            active database.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">6. Cookies & tracking</h2>
          <p className="text-sm text-[#404040] leading-relaxed">
            We use essential cookies to keep you logged in and to provide core functionality. Ad
            networks may use cookies for frequency capping and basic reporting, but no personal
            data is linked.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">7. Contact</h2>
          <p className="text-sm text-[#404040] leading-relaxed">
            If you have any questions about this policy, contact us at{" "}
            <a href="" className="text-purple-600 underline">
              
            </a>.
          </p>
        </section>

        {/* NEW section – required by Google Play */}
        <section className="space-y-2">
          <h2 className="font-semibold text-lg" id="delete">8. Deleting your account & data</h2>
          <p className="text-sm text-[#404040] leading-relaxed">
            You can delete your account and all associated data directly inside the Haven app
            by going to <strong>Profile → Delete Account</strong>. This action is permanent and
            will remove your personal information, photos, matches, messages, and story posts
            from our active database.
          </p>
          <p className="text-sm text-[#404040] leading-relaxed mt-2">
            If you no longer have access to the app, you may request account deletion by sending
            an email to{" "}
            <a href="" className="text-purple-600 underline">
              
            </a>{" "}
            from the email address linked to your Haven account. Please include the subject line
            "Account Deletion Request". We will process your request within 30 days and confirm
            completion via email.
          </p>
        </section>
      </div>
    </div>
  );
}