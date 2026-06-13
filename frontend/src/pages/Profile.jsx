import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Check,
  LogOut,
  Package,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Field = ({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly,
  hint,
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-gray-400">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon
          size={13}
          strokeWidth={1.75}
          className="absolute left-3.5 text-gray-400 pointer-events-none"
        />
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full pl-9 ${isPassword ? "pr-10" : "pr-4"} py-3 text-[13px] rounded-xl border transition-all duration-200 outline-none font-normal
            ${
              readOnly
                ? "bg-gray-50 border-gray-100 text-gray-400 cursor-default select-none"
                : "bg-white border-gray-200 text-gray-800 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5"
            }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 text-gray-300 hover:text-gray-500 transition-colors"
          >
            {show ? (
              <EyeOff size={13} strokeWidth={1.75} />
            ) : (
              <Eye size={13} strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>
      {hint && <p className="text-[11px] text-gray-400 pl-1">{hint}</p>}
    </div>
  );
};

/* ── Section wrapper ── */
const Section = ({ title, children }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-3">
      <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-gray-400">
        {title}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
    {children}
  </div>
);

const Profile = () => {
  const { token, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const [accountEmail, setAccountEmail] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token },
        });
        if (res.data.success) {
          const u = res.data.user;
          setAccountEmail(u.email);
          setForm({
            name: u.name || "",
            phone: u.phone || "",
            location: u.location || "",
          });
        } else {
          toast.error("Failed to load profile");
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [token]);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const setPass = (key) => (e) =>
    setPasswords((p) => ({ ...p, [key]: e.target.value }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        { name: form.name, phone: form.phone, location: form.location },
        { headers: { token } },
      );
      if (res.data.success) toast.success("Profile updated");
      else toast.error(res.data.message);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      toast.error("Please fill all password fields");
      return;
    }
    if (passwords.next.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/user/change-password`,
        { currentPassword: passwords.current, newPassword: passwords.next },
        { headers: { token } },
      );
      if (res.data.success) {
        toast.success("Password changed");
        setPasswords({ current: "", next: "", confirm: "" });
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  const initials = form.name
    ? form.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  if (fetching) {
    return (
      <div className="border-t border-gray-100 pt-10 pb-16 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-[12px] text-gray-400 tracking-wide">
            Loading profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 pt-10 pb-20">
      <div className="max-w-lg mx-auto flex flex-col gap-10">
        {/* ── Identity block ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[15px] font-semibold tracking-wider">
              {initials}
            </span>
          </div>

          {/* Name + email + actions */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p className="text-[10.5px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-0.5">
                  Account
                </p>
                <h1 className="text-[1.45rem] font-semibold leading-tight tracking-tight text-gray-900 truncate">
                  {form.name || "My Account"}
                </h1>
                <p className="text-[13px] text-gray-400 mt-0.5 truncate">
                  {accountEmail}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate("/orders")}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[11.5px] font-medium text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 hover:text-gray-900 transition-all duration-200"
                >
                  <Package size={12} strokeWidth={1.75} />
                  Orders
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[11.5px] font-medium text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 hover:text-gray-900 transition-all duration-200"
                >
                  <ShoppingCart size={12} strokeWidth={1.75} />
                  Cart
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[11.5px] font-medium text-red-500 border border-red-100 rounded-full hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut size={12} strokeWidth={1.75} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Personal Details ── */}
        <Section title="Personal Details">
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                icon={User}
                value={form.name}
                onChange={setField("name")}
                placeholder="Your name"
              />
              <Field
                label="Phone"
                icon={Phone}
                value={form.phone}
                onChange={setField("phone")}
                placeholder="+91 00000 00000"
              />
            </div>
            <Field
              label="Email"
              icon={Mail}
              value={accountEmail}
              readOnly
              hint="Registered email cannot be changed."
            />
            <Field
              label="Location"
              icon={MapPin}
              value={form.location}
              onChange={setField("location")}
              placeholder="City, State"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="submit"
                disabled={saveLoading}
                className={`flex items-center gap-2 text-[11.5px] tracking-[0.1em] font-semibold px-6 py-2.5 rounded-full uppercase transition-all duration-200
                  ${
                    saveLoading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-black active:scale-[0.985] shadow-sm shadow-gray-200"
                  }`}
              >
                <Check size={12} strokeWidth={2.5} />
                {saveLoading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </Section>

        {/* ── Change Password ── */}
        <Section title="Security">
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            {/* Shield notice */}
            <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
              <ShieldCheck
                size={14}
                strokeWidth={1.75}
                className="text-gray-400 mt-0.5 flex-shrink-0"
              />
              <p className="text-[12px] text-gray-500 leading-relaxed">
                Choose a strong password with at least 8 characters. You'll be
                asked to re-enter your current password to confirm.
              </p>
            </div>

            <Field
              label="Current Password"
              icon={Lock}
              type="password"
              value={passwords.current}
              onChange={setPass("current")}
              placeholder="••••••••"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="New Password"
                icon={Lock}
                type="password"
                value={passwords.next}
                onChange={setPass("next")}
                placeholder="••••••••"
              />
              <Field
                label="Confirm Password"
                icon={Lock}
                type="password"
                value={passwords.confirm}
                onChange={setPass("confirm")}
                placeholder="••••••••"
              />
            </div>

            {/* Strength hint — only show when typing */}
            {passwords.next.length > 0 && (
              <div className="flex items-center gap-2 pl-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 w-8 rounded-full transition-all duration-300 ${
                        passwords.next.length >= i * 3
                          ? passwords.next.length >= 12
                            ? "bg-emerald-400"
                            : passwords.next.length >= 8
                              ? "bg-amber-400"
                              : "bg-red-300"
                          : "bg-gray-100"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400">
                  {passwords.next.length < 8
                    ? "Too short"
                    : passwords.next.length < 12
                      ? "Fair"
                      : "Strong"}
                </span>
              </div>
            )}

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 text-[11.5px] tracking-[0.1em] font-semibold px-6 py-2.5 rounded-full uppercase transition-all duration-200
                  ${
                    loading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-black active:scale-[0.985] shadow-sm shadow-gray-200"
                  }`}
              >
                <Check size={12} strokeWidth={2.5} />
                {loading ? "Updating…" : "Update Password"}
              </button>
            </div>
          </form>
        </Section>
      </div>
    </div>
  );
};

export default Profile;
