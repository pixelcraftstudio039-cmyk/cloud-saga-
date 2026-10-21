import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';

export const AwsConnectModal: React.FC = () => {
  const { 
    showAwsConnectModal, 
    setShowAwsConnectModal, 
    awsConfig, 
    connectAwsRole, 
    disconnectAws 
  } = useApp();

  const [roleArn, setRoleArn] = useState(awsConfig.roleArn || 'arn:aws:iam::123456789012:role/CloudSageRole');
  const [externalId] = useState(awsConfig.externalId || 'cloudsage-external-id-example');
  const [region, setRegion] = useState(awsConfig.region || 'us-east-1');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedPolicy, setCopiedPolicy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!showAwsConnectModal) return null;

  const policyJson = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudSageCostExplorerReadOnly",
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetCostForecast",
        "ce:GetDimensionValues",
        "ce:GetTags"
      ],
      "Resource": "*"
    }
  ]
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(policyJson);
    setCopiedPolicy(true);
    setTimeout(() => setCopiedPolicy(false), 2000);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsVerifying(true);

    if (!roleArn.startsWith('arn:aws:iam::')) {
      setError('Invalid ARN format. Must begin with arn:aws:iam::[account-id]:role/...');
      setIsVerifying(false);
      return;
    }

    const result = await connectAwsRole(roleArn, externalId, region);
    setIsVerifying(false);
    if (result.success) {
      setSuccess('AWS Cost Explorer connection established and validated successfully!');
      setTimeout(() => {
        setShowAwsConnectModal(false);
        setSuccess(null);
      }, 1200);
    } else {
      setError(result.reason || 'Failed to assume role. Check trust policy External ID and permissions.');
    }
  };

  const handleResetDemo = async () => {
    await disconnectAws();
    setSuccess('Switched back to Demo Sample Mode.');
    setTimeout(() => {
      setShowAwsConnectModal(false);
      setSuccess(null);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">AWS Cost Explorer Integration</h3>
              <p className="text-xs text-neutral-500">Read-Only Cross-Account IAM Role Architecture</p>
            </div>
          </div>
          <button
            onClick={() => setShowAwsConnectModal(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-[#F5F7FA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-700">
          <div className="p-3.5 rounded-xl bg-[#EAF4FC] border border-blue-100 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-neutral-900 block">Least-Privilege Security Model</span>
              CloudSage AI connects using AWS IAM STS assume-role federation. We only inspect Cost Explorer billing figures — we cannot create, modify, or delete any AWS cloud resources.
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Step 1: IAM Policy */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-neutral-900">
                1. Required AWS IAM Policy (Read-Only)
              </label>
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-[11px] font-medium text-[#2563EB] hover:underline"
              >
                {copiedPolicy ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPolicy ? 'Copied Policy JSON' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-[#171717] text-neutral-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-neutral-800">
              {policyJson}
            </pre>
          </div>

          {/* Form */}
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block font-semibold text-neutral-900 mb-1">
                2. Cross-Account External ID (Optional for Live Role)
              </label>
              <input
                type="text"
                readOnly
                value={externalId}
                className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#E5E7EB] rounded-lg font-mono text-[11px] text-neutral-800 select-all cursor-copy"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Attach this External ID in your AWS IAM Trust Relationship. Zero API keys or credentials needed for Demo Mode.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-900 mb-1">
                  3. AWS IAM Role ARN
                </label>
                <input
                  type="text"
                  placeholder="arn:aws:iam::123456789012:role/CloudSageCostExplorerRole"
                  value={roleArn}
                  onChange={(e) => setRoleArn(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-900 mb-1">
                  Default Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="us-east-1">us-east-1 (N. Virginia)</option>
                  <option value="us-west-2">us-west-2 (Oregon)</option>
                  <option value="eu-west-1">eu-west-1 (Ireland)</option>
                  <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={handleResetDemo}
                className="px-3 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-[#F5F7FA] font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Demo Sample Mode</span>
              </button>

              <button
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying IAM Permissions...</span>
                  </>
                ) : (
                  <span>Test & Save AWS Role</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
