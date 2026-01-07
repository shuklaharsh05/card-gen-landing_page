import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiService } from "../lib/api.js";
import * as XLSX from "xlsx";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  StickyNote,
  CheckCircle,
  AlertCircle,
  Search,
  UserPlus,
  X,
} from "lucide-react";

export default function Contacts() {
  const { user } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [noDataExportMessage, setNoDataExportMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    designation: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="w-full mx-auto font-poppins px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-yellow-900 font-semibold mb-1">
              You need to be signed in
            </h2>
            <p className="text-sm text-yellow-800">
              Please sign in to save contacts to your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setContactsLoading(true);
        setContactsError("");
        const res = await apiService.getContacts(user._id || user.id);
        if (res.success && Array.isArray(res.data)) {
          setContacts(res.data);
        } else if (res.success && Array.isArray(res.data?.contacts)) {
          setContacts(res.data.contacts);
        } else {
          setContacts([]);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setContactsError("Unable to load contacts right now.");
      } finally {
        setContactsLoading(false);
      }
    };

    fetchContacts();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Name is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId: user._id || user.id,
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        designation: formData.designation.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      };

      const response = await apiService.saveContact(payload);

      if (!response.success) {
        throw new Error(response.error || "Failed to save contact");
      }

      setSuccessMessage("Contact saved successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        designation: "",
        notes: "",
      });
      // Refresh contacts list after saving
      try {
        const res = await apiService.getContacts(user._id || user.id);
        if (res.success && Array.isArray(res.data)) {
          setContacts(res.data);
        } else if (res.success && Array.isArray(res.data?.contacts)) {
          setContacts(res.data.contacts);
        }
      } catch (err) {
        console.error("Error refreshing contacts:", err);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to save contact.");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const name = (contact.name || "").toLowerCase();
    const email = (contact.email || "").toLowerCase();
    const phone = (contact.phone || "").toLowerCase();
    const company = (contact.company || "").toLowerCase();
    return (
      name.includes(q) ||
      email.includes(q) ||
      phone.includes(q) ||
      company.includes(q)
    );
  });

  return (
    <div className="w-full mx-auto font-poppins px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
              Contacts
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Save and search contacts you meet using your digital business
              card.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto sm:min-w-[300px] lg:min-w-[420px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search contacts by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-slate-300 rounded-full focus:outline-1 focus:outline-black text-xs sm:text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setSuccessMessage("");
                setErrorMessage("");
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  company: "",
                  designation: "",
                  notes: "",
                });
                setModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <UserPlus className="w-4 h-4" />
              Save Contact
            </button>
            <button
              type="button"
              onClick={() => {
                const dataToExport =
                  filteredContacts.length > 0 || searchQuery
                    ? filteredContacts
                    : contacts;
                if (!dataToExport || dataToExport.length === 0) {
                  setNoDataExportMessage(
                    "No contacts available to export right now."
                  );
                  return;
                }
                const excelData = dataToExport.map((c) => ({
                  Name: c.name || "",
                  Email: c.email || "",
                  Phone: c.phone || "",
                  Company: c.company || "",
                  Designation: c.designation || "",
                  Notes: c.notes || "",
                }));
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(excelData);
                ws["!cols"] = [
                  { wch: 20 },
                  { wch: 30 },
                  { wch: 18 },
                  { wch: 25 },
                  { wch: 20 },
                  { wch: 40 },
                ];
                XLSX.utils.book_append_sheet(wb, ws, "Contacts");
                const fileName = `contacts_${
                  new Date().toISOString().split("T")[0]
                }.xlsx`;
                const excelBuffer = XLSX.write(wb, {
                  bookType: "xlsx",
                  type: "array",
                });
                const blob = new Blob([excelBuffer], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.download = fileName;
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-xs sm:text-sm font-medium hover:bg-green-700"
            >
              Export
            </button>
          </div>
        </div>

        {searchQuery && (
          <p className="text-xs sm:text-sm text-slate-600">
            {filteredContacts.length === 0
              ? "No contacts found matching your search."
              : `Found ${filteredContacts.length} contact${
                  filteredContacts.length > 1 ? "s" : ""
                } matching "${searchQuery}"`}
          </p>
        )}
      </div>

      {contactsError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-xs sm:text-sm text-red-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
          <span>{contactsError}</span>
        </div>
      )}

      {noDataExportMessage && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
              Nothing to export
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              {noDataExportMessage}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setNoDataExportMessage("")}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {contactsLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-sm sm:text-base text-slate-600">
            You haven't saved any contacts yet. Click{" "}
            <span className="font-semibold">Save Contact</span> to add your
            first one.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-6 space-y-3">
          {filteredContacts.map((contact) => (
            <div
              key={
                contact._id ||
                `${contact.name}-${contact.phone || contact.email}`
              }
              className="border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-semibold text-slate-900">
                  {contact.name}
                </p>
                <p className="text-xs sm:text-sm text-slate-600">
                  {[contact.designation, contact.company]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-600">
                  {contact.email && <span>{contact.email}</span>}
                  {contact.phone && <span>{contact.phone}</span>}
                </div>
                {contact.notes && (
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-500 line-clamp-2">
                    {contact.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                Save Contact
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {(successMessage || errorMessage) && (
              <div className="mb-4">
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800">{successMessage}</p>
                  </div>
                )}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-xs sm:text-sm mt-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800">{errorMessage}</p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    placeholder="Jane Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      placeholder="jane@example.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      placeholder="+91 98765 43210"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Company
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      placeholder="Acme Inc."
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Designation
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      placeholder="Marketing Manager"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Notes
                </label>
                <div className="relative">
                  <StickyNote className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base resize-none"
                    placeholder="Where you met, what you discussed, follow-up actions..."
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
