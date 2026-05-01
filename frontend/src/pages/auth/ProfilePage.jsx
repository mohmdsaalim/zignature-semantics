import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';
import { profileApi } from '../../api/profile';
import { authApi } from '../../api/auth';
import { HiOutlineDocumentText, HiOutlineBriefcase, HiOutlineLink, HiOutlineLockClosed, HiOutlineUser, HiOutlineTrash, HiArrowUpTray } from 'react-icons/hi2';
import SEO from '../../components/seo/SEO';

const ProfilePage = () => {
  const { user, isAuthenticated, requireAuth, logout, error, clearError } = useAuth();
  const storeUser = useAuthStore((state) => state.user);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingCoverLetter, setUploadingCoverLetter] = useState(false);

  useEffect(() => {
    if (!requireAuth('/login')) {
      return;
    }
    fetchProfile();
  }, [requireAuth]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const fetchProfile = async () => {
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
      setFullName(data.full_name || '');
      setPhone(data.phone || '');
      setLocation(data.location || '');
      setBio(data.bio || '');
      setLinkedinUrl(data.linkedin_url || '');
      setPortfolioUrl(data.portfolio_url || '');
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    setSaving(true);

    try {
      const data = await profileApi.updateProfile({
        full_name: fullName,
        phone: phone,
        location: location,
        bio: bio,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
      });
      setProfile(data);
      setSuccess('Profile updated successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update profile';
      setFormError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setFormError('Please fill in all password fields');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setFormError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      await authApi.changePassword(currentPassword, newPassword, newPasswordConfirm);
      setSuccess('Password changed successfully. Please log in again.');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setTimeout(() => logout('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.current_password?.[0] || 'Failed to change password';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setFormError('');
    setSuccess('');

    try {
      const data = await profileApi.uploadResume(file);
      setProfile((prev) => ({ ...prev, resume: data.resume }));
      setSuccess('Resume uploaded successfully');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to upload resume';
      setFormError(msg);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleCoverLetterUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCoverLetter(true);
    setFormError('');
    setSuccess('');

    try {
      const data = await profileApi.uploadCoverLetter(file);
      setProfile((prev) => ({ ...prev, cover_letter: data.cover_letter }));
      setSuccess('Cover letter uploaded successfully');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to upload cover letter';
      setFormError(msg);
    } finally {
      setUploadingCoverLetter(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;
    try {
      await profileApi.deleteResume();
      setProfile((prev) => ({ ...prev, resume: null }));
      setSuccess('Resume deleted');
    } catch (err) {
      setFormError('Failed to delete resume');
    }
  };

  const handleDeleteCoverLetter = async () => {
    if (!window.confirm('Are you sure you want to delete your cover letter?')) return;
    try {
      await profileApi.deleteCoverLetter();
      setProfile((prev) => ({ ...prev, cover_letter: null }));
      setSuccess('Cover letter deleted');
    } catch (err) {
      setFormError('Failed to delete cover letter');
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-primary-50 min-h-screen flex items-center justify-center pt-24">
        <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-primary-900 rounded-full bg-primary-200"></div>
          <div className="w-32 h-4 bg-primary-900"></div>
          <div className="w-24 h-2 bg-primary-400"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const isGoogleUser = storeUser?.auth_provider === 'google';
  const displayEmail = storeUser?.email || user?.email;
  const initial = fullName ? fullName.charAt(0).toUpperCase() : displayEmail?.charAt(0).toUpperCase() || 'Z';

  return (
    <>
      <SEO 
        title="My Profile"
        description="Manage your Zignature Semantics profile, update your information, and track your job applications."
        noindex={true}
      />
      <div className="relative w-full bg-primary-50 min-h-screen pb-24 pt-28 md:pt-36 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Background Grid */}
      <style>
        {`
          .bg-grid-pattern {
            background-image: linear-gradient(to right, rgba(30, 58, 138, 0.10) 2px, transparent 2px),
                              linear-gradient(to bottom, rgba(30, 58, 138, 0.10) 2px, transparent 2px);
            background-size: 40px 40px;
          }
        `}
      </style>
      <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- NOTIFICATIONS --- */}
        {(formError || error) && (
          <div className="mb-8 bg-white border-4 border-red-600 p-4 shadow-[6px_6px_0_0_#dc2626] flex items-center gap-4">
            <div className="bg-red-600 text-white p-2 border-2 border-red-900 font-black">!</div>
            <p className="text-red-700 font-bold uppercase tracking-wider">{formError || error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-8 bg-white border-4 border-green-600 p-4 shadow-[6px_6px_0_0_#16a34a] flex items-center gap-4">
            <div className="bg-green-600 text-white p-2 border-2 border-green-900 font-black">✓</div>
            <p className="text-green-700 font-bold uppercase tracking-wider">{success}</p>
          </div>
        )}

        {/* --- HEADER SUMMARY CARD --- */}
        <div className="bg-white border-4 border-primary-900 shadow-[8px_8px_0_0_#1e3a8a] p-6 md:p-10 mb-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative overflow-hidden">
          {/* Abstract geometric decoration */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 border-4 border-primary-900 rounded-full opacity-50 pointer-events-none"></div>
          
          <div className="w-24 h-24 md:w-32 md:h-32 bg-primary-600 border-4 border-primary-900 flex items-center justify-center text-white text-4xl md:text-6xl font-black shadow-[4px_4px_0_0_#1e3a8a] shrink-0">
            {initial}
          </div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-3xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter mb-2">
              {fullName || 'Add Your Name'}
            </h1>
            <p className="text-lg font-bold text-primary-600 mb-4">{displayEmail}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-primary-800">
              {location && (
                <div className="flex items-center gap-1.5 bg-primary-50 px-3 py-1 border-2 border-primary-900">
                  <span>📍</span> {location}
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-1.5 bg-primary-50 px-3 py-1 border-2 border-primary-900">
                  <span>📞</span> {phone}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- MAIN DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN (Forms) */}
          <div className="lg:col-span-8 space-y-10">
            
            <form onSubmit={handleProfileUpdate} className="bg-white border-4 border-primary-900 shadow-[8px_8px_0_0_#1e3a8a] p-6 md:p-8">
              <div className="flex items-center gap-3 border-b-4 border-primary-900 pb-4 mb-6">
                <HiOutlineUser className="w-8 h-8 text-primary-900" />
                <h2 className="text-2xl font-black text-primary-900 uppercase tracking-wider">Personal Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="fullName">
                    Full Name
                  </label>
                  <input 
                    type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-primary-50 border-2 border-primary-900 p-3 font-bold text-primary-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all"
                    placeholder="E.g. John Doe"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="phone">
                    Phone Number
                  </label>
                  <input 
                    type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-primary-50 border-2 border-primary-900 p-3 font-bold text-primary-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="flex flex-col mb-6">
                <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="location">
                  Location
                </label>
                <input 
                  type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-primary-50 border-2 border-primary-900 p-3 font-bold text-primary-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all"
                  placeholder="City, State, Country"
                />
              </div>

              <div className="flex flex-col mb-8">
                <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="bio">
                  Professional Bio
                </label>
                <textarea 
                  id="bio" rows="4" value={bio} onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-primary-50 border-2 border-primary-900 p-3 font-bold text-primary-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all resize-none"
                  placeholder="Summarize your professional background..."
                ></textarea>
              </div>

              <div className="flex items-center gap-3 border-b-4 border-primary-900 pb-4 mb-6">
                <HiOutlineLink className="w-8 h-8 text-primary-900" />
                <h2 className="text-2xl font-black text-primary-900 uppercase tracking-wider">Web Links</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col">
                  <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="linkedinUrl">
                    LinkedIn Profile
                  </label>
                  <input 
                    type="url" id="linkedinUrl" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-primary-50 border-2 border-primary-900 p-3 font-bold text-primary-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="portfolioUrl">
                    Portfolio / Website
                  </label>
                  <input 
                    type="url" id="portfolioUrl" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full bg-primary-50 border-2 border-primary-900 p-3 font-bold text-primary-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={saving}
                className="w-full bg-primary-900 text-white font-black uppercase tracking-widest text-lg px-8 py-4 border-2 border-primary-900 hover:bg-primary-800 shadow-[6px_6px_0_0_#1e3a8a] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all disabled:opacity-50"
              >
                {saving ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </form>

          </div>

          {/* RIGHT COLUMN (Documents & Security) */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* Documents Card */}
            <div className="bg-white border-4 border-primary-900 shadow-[8px_8px_0_0_#1e3a8a] p-6">
              <div className="flex items-center gap-3 border-b-4 border-primary-900 pb-4 mb-6">
                <HiOutlineDocumentText className="w-7 h-7 text-primary-900" />
                <h2 className="text-xl font-black text-primary-900 uppercase tracking-wider">Documents</h2>
              </div>

              {/* Resume Section */}
              <div className="mb-6">
                <h3 className="font-bold text-primary-900 uppercase tracking-wider mb-3 text-sm">Resume / CV</h3>
                {profile?.resume ? (
                  <div className="flex items-center justify-between bg-primary-50 border-2 border-primary-900 p-3">
                    <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="font-bold text-primary-600 hover:text-primary-900 truncate pr-2">
                      View Resume
                    </a>
                    <button onClick={handleDeleteResume} className="text-red-600 hover:text-red-800 p-1 border-2 border-transparent hover:border-red-600 transition-colors" title="Delete Resume">
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center bg-primary-50 border-2 border-dashed border-primary-900 p-6 hover:bg-primary-100 transition-colors">
                    <HiArrowUpTray className="w-8 h-8 text-primary-900 mb-2" />
                    <span className="font-bold text-primary-900 text-sm uppercase text-center">
                      {uploadingResume ? 'Uploading...' : 'Upload Resume (PDF/DOC)'}
                    </span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" disabled={uploadingResume} />
                  </label>
                )}
              </div>

              {/* Cover Letter Section */}
              <div>
                <h3 className="font-bold text-primary-900 uppercase tracking-wider mb-3 text-sm">Cover Letter</h3>
                {profile?.cover_letter ? (
                  <div className="flex items-center justify-between bg-primary-50 border-2 border-primary-900 p-3">
                    <a href={profile.cover_letter} target="_blank" rel="noopener noreferrer" className="font-bold text-primary-600 hover:text-primary-900 truncate pr-2">
                      View Cover Letter
                    </a>
                    <button onClick={handleDeleteCoverLetter} className="text-red-600 hover:text-red-800 p-1 border-2 border-transparent hover:border-red-600 transition-colors" title="Delete Cover Letter">
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center bg-primary-50 border-2 border-dashed border-primary-900 p-6 hover:bg-primary-100 transition-colors">
                    <HiArrowUpTray className="w-8 h-8 text-primary-900 mb-2" />
                    <span className="font-bold text-primary-900 text-sm uppercase text-center">
                      {uploadingCoverLetter ? 'Uploading...' : 'Upload Cover Letter'}
                    </span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleCoverLetterUpload} className="hidden" disabled={uploadingCoverLetter} />
                  </label>
                )}
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white border-4 border-primary-900 shadow-[8px_8px_0_0_#1e3a8a] p-6">
              <div className="flex items-center gap-3 border-b-4 border-primary-900 pb-4 mb-6">
                <HiOutlineLockClosed className="w-7 h-7 text-primary-900" />
                <h2 className="text-xl font-black text-primary-900 uppercase tracking-wider">Security</h2>
              </div>

              {isGoogleUser ? (
                <div className="bg-yellow-50 border-2 border-yellow-500 p-4">
                  <p className="text-yellow-800 font-bold text-sm">
                    Logged in via Google. Manage your password in your Google account settings.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="font-bold text-primary-900 uppercase tracking-wider mb-1 text-xs" htmlFor="currentPassword">Current Password</label>
                    <input 
                      type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-primary-50 border-2 border-primary-900 p-2 font-bold focus:outline-none focus:bg-white focus:shadow-[2px_2px_0_0_#1e3a8a]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold text-primary-900 uppercase tracking-wider mb-1 text-xs" htmlFor="newPassword">New Password</label>
                    <input 
                      type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-primary-50 border-2 border-primary-900 p-2 font-bold focus:outline-none focus:bg-white focus:shadow-[2px_2px_0_0_#1e3a8a]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold text-primary-900 uppercase tracking-wider mb-1 text-xs" htmlFor="newPasswordConfirm">Confirm New Password</label>
                    <input 
                      type="password" id="newPasswordConfirm" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className="w-full bg-primary-50 border-2 border-primary-900 p-2 font-bold focus:outline-none focus:bg-white focus:shadow-[2px_2px_0_0_#1e3a8a]"
                    />
                  </div>
                  <button 
                    type="submit" disabled={saving}
                    className="w-full bg-primary-900 text-white font-black uppercase tracking-widest text-sm px-4 py-3 border-2 border-primary-900 hover:bg-primary-800 shadow-[4px_4px_0_0_#1e3a8a] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-50 mt-2"
                  >
                    {saving ? 'Processing...' : 'Update Password'}
                  </button>
                </form>
              )}
            </div>

            </div>
          
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfilePage;