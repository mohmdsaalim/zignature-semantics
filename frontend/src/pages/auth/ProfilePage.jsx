import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';
import { profileApi } from '../../api/profile';
import { authApi } from '../../api/auth';

const ProfilePage = () => {
  const { user, isAuthenticated, requireAuth, logout, error, clearError } = useAuth();
  const storeUser = useAuthStore((state) => state.user);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [activeTab, setActiveTab] = useState('profile');
  
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
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update profile';
      setFormError(msg);
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
    if (!confirm('Are you sure you want to delete your resume?')) return;
    
    try {
      await profileApi.deleteResume();
      setProfile((prev) => ({ ...prev, resume: null }));
      setSuccess('Resume deleted');
    } catch (err) {
      setFormError('Failed to delete resume');
    }
  };

  const handleDeleteCoverLetter = async () => {
    if (!confirm('Are you sure you want to delete your cover letter?')) return;
    
    try {
      await profileApi.deleteCoverLetter();
      setProfile((prev) => ({ ...prev, cover_letter: null }));
      setSuccess('Cover letter deleted');
    } catch (err) {
      setFormError('Failed to delete cover letter');
    }
  };

  const handleLogout = async () => {
    await logout('/');
  };

  if (loading) {
    return (
      <div className="w-full bg-primary-900 min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="text-white font-mono text-xl animate-pulse">LOADING_PROFILE...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isGoogleUser = storeUser?.auth_provider === 'google';

  return (
    <div className="w-full bg-primary-900 min-h-[calc(100vh-100px)] relative z-10 flex flex-col lg:flex-row overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>
      
      <div className="w-full lg:w-5/12 bg-primary-900 p-6 md:p-10 lg:p-12 flex flex-col justify-between text-white relative flex-shrink-0">
        <div className="relative z-10 flex flex-col h-full">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-blue-400 animate-pulse"></div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">PROFILE__ACCESS</p>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
              Operative <br className="hidden md:block" /> Profile <br className="hidden md:block" /> Control.
            </h2>

            <p className="text-sm md:text-base text-primary-200/80 font-medium leading-snug mb-8 max-w-sm">
              Manage your operative credentials, upload deployment documents, and configure access protocols.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6 font-mono text-sm mt-auto mb-10">
            <div>
              <p className="text-primary-400/60 uppercase tracking-widest mb-1 text-[9px] font-bold">/ Identity</p>
              <p className="text-base font-bold tracking-tight">{storeUser?.email || user?.email}</p>
            </div>
            <div>
              <p className="text-primary-400/60 uppercase tracking-widest mb-1 text-[9px] font-bold">/ Provider</p>
              <p className="text-base font-bold tracking-tight">{isGoogleUser ? 'Google OAuth' : 'Email/Password'}</p>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/20">
            <button 
              onClick={handleLogout}
              className="font-mono text-[10px] text-white/60 hover:text-white uppercase tracking-[0.3em] font-bold transition-colors"
            >
              → Execute Logout
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-7/12 bg-primary-50 p-6 md:p-10 lg:p-16 border-l-0 lg:border-l-8 border-primary-900 relative flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-[40rem] mx-auto lg:mx-0">
          <h3 className="text-2xl md:text-3xl font-black text-primary-900 uppercase tracking-tighter mb-6">Profile Control</h3>
          
          <div className="flex gap-2 mb-8 border-b-2 border-primary-900/20 pb-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2 transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-primary-900 text-white' 
                  : 'text-primary-900/60 hover:text-primary-900'
              }`}
            >
              / Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2 transition-colors ${
                activeTab === 'security' 
                  ? 'bg-primary-900 text-white' 
                  : 'text-primary-900/60 hover:text-primary-900'
              }`}
            >
              / Security
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2 transition-colors ${
                activeTab === 'documents' 
                  ? 'bg-primary-900 text-white' 
                  : 'text-primary-900/60 hover:text-primary-900'
              }`}
            >
              / Documents
            </button>
          </div>
          
          {(formError || error) && (
            <div className="bg-red-50 border-2 border-red-500 p-4 mb-6">
              <p className="text-red-700 font-mono text-sm">{formError || error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-2 border-green-500 p-4 mb-6">
              <p className="text-green-700 font-mono text-sm">{success}</p>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-5 lg:gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                <div className="flex flex-col">
                  <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="fullName">
                    / Full Name
                  </label>
                  <input 
                    type="text" 
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="phone">
                    / Phone
                  </label>
                  <input 
                    type="tel" 
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="location">
                  / Location
                </label>
                <input 
                  type="text" 
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                  placeholder="City, State, Country"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="bio">
                  / Bio
                </label>
                <textarea 
                  id="bio"
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50] resize-none"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                <div className="flex flex-col">
                  <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="linkedinUrl">
                    / LinkedIn URL
                  </label>
                  <input 
                    type="url" 
                    id="linkedinUrl"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="portfolioUrl">
                    / Portfolio URL
                  </label>
                  <input 
                    type="url" 
                    id="portfolioUrl"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto bg-primary-900 text-white font-black uppercase tracking-widest text-sm lg:text-base px-10 py-4 border-4 border-primary-900 hover:bg-white hover:text-primary-900 shadow-[6px_6px_0_0_#1e3a8a] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Update Profile'}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'security' && (
            <div>
              {isGoogleUser ? (
                <div className="bg-yellow-50 border-2 border-yellow-500 p-6">
                  <p className="text-yellow-800 font-mono text-sm">
                    You are logged in with Google. Password management is handled by Google. 
                    Use your Google account settings to manage your credentials.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="flex flex-col gap-5 lg:gap-6">
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="currentPassword">
                      / Current Access Code
                    </label>
                    <input 
                      type="password" 
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="newPassword">
                      / New Access Code
                    </label>
                    <input 
                      type="password" 
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                      placeholder="Minimum 8 characters"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="newPasswordConfirm">
                      / Confirm New Access Code
                    </label>
                    <input 
                      type="password" 
                      id="newPasswordConfirm"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                      placeholder="Re-enter new password"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={saving}
                      className="w-full md:w-auto bg-primary-900 text-white font-black uppercase tracking-widest text-sm lg:text-base px-10 py-4 border-4 border-primary-900 hover:bg-white hover:text-primary-900 shadow-[6px_6px_0_0_#1e3a8a] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Processing...' : 'Change Access Code'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div className="flex flex-col gap-6">
              <div className="bg-white border-2 border-primary-900/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-mono text-sm font-bold text-primary-900 uppercase tracking-widest">/ Resume</h4>
                    <p className="text-primary-900/60 font-mono text-xs mt-1">
                      {profile?.resume ? 'Uploaded' : 'No resume uploaded'}
                    </p>
                  </div>
                  {profile?.resume && (
                    <button
                      onClick={handleDeleteResume}
                      className="text-red-600 font-mono text-xs uppercase hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {profile?.resume ? (
                  <div className="flex items-center gap-4">
                    <a 
                      href={profile.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-900 font-bold hover:underline"
                    >
                      View Resume →
                    </a>
                  </div>
                ) : (
                  <label className="cursor-pointer inline-block">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                    <span className="inline-block bg-primary-900 text-white font-black uppercase tracking-widest text-xs px-6 py-3 border-4 border-primary-900 hover:bg-white hover:text-primary-900 transition-all">
                      {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                    </span>
                  </label>
                )}
              </div>

              <div className="bg-white border-2 border-primary-900/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-mono text-sm font-bold text-primary-900 uppercase tracking-widest">/ Cover Letter</h4>
                    <p className="text-primary-900/60 font-mono text-xs mt-1">
                      {profile?.cover_letter ? 'Uploaded' : 'No cover letter uploaded'}
                    </p>
                  </div>
                  {profile?.cover_letter && (
                    <button
                      onClick={handleDeleteCoverLetter}
                      className="text-red-600 font-mono text-xs uppercase hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {profile?.cover_letter ? (
                  <div className="flex items-center gap-4">
                    <a 
                      href={profile.cover_letter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-900 font-bold hover:underline"
                    >
                      View Cover Letter →
                    </a>
                  </div>
                ) : (
                  <label className="cursor-pointer inline-block">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleCoverLetterUpload}
                      className="hidden"
                      disabled={uploadingCoverLetter}
                    />
                    <span className="inline-block bg-primary-900 text-white font-black uppercase tracking-widest text-xs px-6 py-3 border-4 border-primary-900 hover:bg-white hover:text-primary-900 transition-all">
                      {uploadingCoverLetter ? 'Uploading...' : 'Upload Cover Letter'}
                    </span>
                  </label>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;