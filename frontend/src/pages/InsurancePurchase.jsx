import { useEffect, useMemo, useState } from "react";
import {
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  HeartHandshake,
  Shield,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const InsurancePurchase = () => {
  const { user, token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [myPolicies, setMyPolicies] = useState([]);
  const [summary, setSummary] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    totalCoverage: 0,
    monthlyPolicies: 0,
  });
  const [premiumFrequency, setPremiumFrequency] = useState("ANNUAL");
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelationship, setNomineeRelationship] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingPlanId, setSubmittingPlanId] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [planData, policyData] = await Promise.all([
          api.getPolicyPlans(),
          api.getMyPolicies(token),
        ]);

        setPlans(planData);
        setMyPolicies(policyData.policies || []);
        setSummary(policyData.summary || {});
        setSelectedPlanId((current) => current || planData[0]?.id || "");
      } catch (loadError) {
        setError(loadError.message || "Failed to load insurance plans");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadData();
    }
  }, [token]);

  const featuredPlan = useMemo(
    () => plans.find((plan) => plan.featured) || plans[0],
    [plans],
  );

  const refreshPolicies = async () => {
    const policyData = await api.getMyPolicies(token);
    setMyPolicies(policyData.policies || []);
    setSummary(policyData.summary || {});
  };

  const handlePurchase = async (planId) => {
    try {
      setSubmittingPlanId(planId);
      setError("");
      setSuccessMessage("");

      const response = await api.purchasePolicy(token, {
        planId,
        premiumFrequency,
        nomineeName,
        nomineeRelationship,
      });

      await refreshPolicies();
      setSuccessMessage(
        `${response.policy.planName} purchased successfully. Policy number: ${response.policy.policyNumber}`,
      );
      setNomineeName("");
      setNomineeRelationship("");
      setSelectedPlanId(planId);
    } catch (purchaseError) {
      setError(purchaseError.message || "Unable to purchase policy");
    } finally {
      setSubmittingPlanId("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-8 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Insurance purchase system is now live
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Buy the right plan for {user?.name?.split(" ")[0] || "you"}
            </h1>
            <p className="text-blue-100 text-lg">
              Compare plans, choose your premium cycle, assign a nominee, and
              keep every purchased policy in one place.
            </p>
          </div>
          {featuredPlan && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 min-w-[280px] border border-white/10">
              <p className="text-sm text-blue-100 mb-2">Featured plan</p>
              <p className="text-2xl font-semibold">{featuredPlan.name}</p>
              <p className="text-blue-100 mt-1">{featuredPlan.category}</p>
              <p className="text-3xl font-bold mt-4">
                {currency.format(featuredPlan.annualPremium)}
                <span className="text-sm font-medium text-blue-100">
                  {" "}
                  / year
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Shield className="h-6 w-6 text-blue-600" />}
          label="Active Policies"
          value={summary.activePolicies || 0}
        />
        <StatCard
          icon={<HeartHandshake className="h-6 w-6 text-purple-600" />}
          label="Total Policies"
          value={summary.totalPolicies || 0}
        />
        <StatCard
          icon={<BadgeIndianRupee className="h-6 w-6 text-emerald-600" />}
          label="Total Coverage"
          value={currency.format(summary.totalCoverage || 0)}
        />
        <StatCard
          icon={<CalendarDays className="h-6 w-6 text-amber-600" />}
          label="Monthly Premium Plans"
          value={summary.monthlyPolicies || 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-8 mb-8">
        <section className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available insurance plans
                </h2>
                <p className="text-gray-600 mt-1">
                  Plans are preloaded in the backend and ready for authenticated
                  purchase.
                </p>
              </div>
              <div className="inline-flex rounded-xl bg-gray-100 p-1">
                {["ANNUAL", "MONTHLY"].map((frequency) => (
                  <button
                    key={frequency}
                    type="button"
                    onClick={() => setPremiumFrequency(frequency)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      premiumFrequency === frequency
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    {frequency === "ANNUAL"
                      ? "Annual billing"
                      : "Monthly billing"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const price =
                premiumFrequency === "MONTHLY"
                  ? plan.monthlyPremium
                  : plan.annualPremium;

              return (
                <article
                  key={plan.id}
                  className={`rounded-2xl border bg-white shadow-md p-6 transition-all ${
                    isSelected
                      ? "border-blue-500 shadow-blue-100"
                      : "border-transparent hover:border-blue-200 hover:shadow-lg"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          {plan.category}
                        </span>
                        {plan.featured && (
                          <span className="inline-flex px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                            Most popular
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {plan.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`text-sm font-semibold ${
                        isSelected
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>

                  <p className="text-gray-600 mb-5 min-h-12">
                    {plan.description}
                  </p>

                  <div className="mb-5">
                    <p className="text-3xl font-bold text-gray-900">
                      {currency.format(price)}
                      <span className="text-sm font-medium text-gray-500">
                        {premiumFrequency === "MONTHLY"
                          ? " / month"
                          : " / year"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Coverage up to {currency.format(plan.coverageAmount)} with
                      deductible of {currency.format(plan.deductible)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                    <InfoPill
                      label="Claim Ratio"
                      value={plan.claimSettlementRatio}
                    />
                    <InfoPill
                      label="Coverage"
                      value={currency.format(plan.coverageAmount)}
                    />
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-3 text-sm text-gray-700"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handlePurchase(plan.id)}
                    disabled={Boolean(submittingPlanId)}
                    className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg disabled:opacity-60 transition-all"
                  >
                    {submittingPlanId === plan.id
                      ? "Processing..."
                      : "Purchase this plan"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Purchase details
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Add nominee details before completing the plan purchase.
            </p>

            <div className="space-y-4">
              <Field
                label="Nominee name"
                value={nomineeName}
                onChange={setNomineeName}
                placeholder="Enter nominee full name"
              />
              <Field
                label="Relationship"
                value={nomineeRelationship}
                onChange={setNomineeRelationship}
                placeholder="Spouse, Parent, Sibling..."
              />
            </div>

            {successMessage && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                My purchased policies
              </h2>
              <span className="text-sm text-gray-500">
                {myPolicies.length} total
              </span>
            </div>

            {myPolicies.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center">
                <p className="text-gray-700 font-medium">
                  No active policy yet
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Your first purchase will appear here with its policy number
                  and coverage window.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className="rounded-2xl border border-slate-200 p-4 bg-slate-50"
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {policy.planName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {policy.policyNumber}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        {policy.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div>
                        <p className="text-gray-500">Premium</p>
                        <p className="font-medium text-gray-900">
                          {currency.format(policy.premiumAmount)} /{" "}
                          {policy.premiumFrequency.toLowerCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Coverage</p>
                        <p className="font-medium text-gray-900">
                          {currency.format(policy.coverageAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Start date</p>
                        <p className="font-medium text-gray-900">
                          {dateFormatter.format(
                            new Date(policy.coverageStartDate),
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">End date</p>
                        <p className="font-medium text-gray-900">
                          {dateFormatter.format(new Date(policy.coverageEndDate))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-2xl shadow-md p-6">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900 break-words">{value}</p>
    <p className="text-gray-600 mt-1">{label}</p>
  </div>
);

const InfoPill = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 px-4 py-3">
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
  </div>
);

const Field = ({ label, value, onChange, placeholder }) => (
  <label className="block">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
  </label>
);

export default InsurancePurchase;
