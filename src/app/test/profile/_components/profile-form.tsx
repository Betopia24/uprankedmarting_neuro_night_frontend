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
            <input
              className="border rounded p-0.5"
              placeholder="Full Name (as per ID)"
            />
            <input
              className="border rounded p-0.5"
              placeholder="Date of Birth (MM/DD/YYYY)"
            />
            <input className="border rounded p-0.5" placeholder="Gender" />
            <input className="border rounded p-0.5" placeholder="SSN or TIN" />
            <input className="border rounded p-0.5" placeholder="Loyalty ID" />
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h3 className="font-semibold mb-2">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="border rounded p-0.5"
              placeholder="Email Address"
            />
            <input
              className="border rounded p-0.5"
              placeholder="Phone Number"
            />
            <input
              className="border rounded p-0.5"
              placeholder="Emergency Contact Name & Number"
            />
            <input
              className="border rounded p-0.5"
              placeholder="Residential Address (with ZIP)"
            />
          </div>
        </section>

        {/* Employment Information */}
        <section>
          <h3 className="font-semibold mb-2">Employment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="border rounded p-0.5" placeholder="Job Title" />
            <input
              className="border rounded p-0.5"
              placeholder="Employment Type"
            />
            <input className="border rounded p-0.5" placeholder="Experience" />
            <input className="border rounded p-0.5" placeholder="Hire Date" />
            <input
              className="border rounded p-0.5"
              placeholder="Work Schedule"
            />
          </div>
        </section>
      </form>
    </div>
  );
}
