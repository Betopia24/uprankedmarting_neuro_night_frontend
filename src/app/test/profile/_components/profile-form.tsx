// app/profile/_components/profile-form.tsx
export default function ProfileForm() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

      <form className="space-y-8">
        {/* Personal Information */}
        <section>
          <h3 className="font-semibold mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="input" placeholder="Full Name (as per ID)" />
            <input className="input" placeholder="Date of Birth (MM/DD/YYYY)" />
            <input className="input" placeholder="Gender" />
            <input className="input" placeholder="SSN or TIN" />
            <input className="input" placeholder="Loyalty ID" />
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h3 className="font-semibold mb-2">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="input" placeholder="Email Address" />
            <input className="input" placeholder="Phone Number" />
            <input
              className="input"
              placeholder="Emergency Contact Name & Number"
            />
            <input
              className="input"
              placeholder="Residential Address (with ZIP)"
            />
          </div>
        </section>

        {/* Employment Information */}
        <section>
          <h3 className="font-semibold mb-2">Employment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="input" placeholder="Job Title" />
            <input className="input" placeholder="Employment Type" />
            <input className="input" placeholder="Experience" />
            <input className="input" placeholder="Hire Date" />
            <input className="input" placeholder="Work Schedule" />
          </div>
        </section>
      </form>
    </div>
  );
}
