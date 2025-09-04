import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, User, Briefcase, MapPin, IndianRupee } from 'lucide-react';
import { i18n } from '@/services/i18n';
import { storage, UserProfile } from '@/services/storage';

const ageRanges = [
  { value: '18-25', label: '18-25 years' },
  { value: '26-35', label: '26-35 years' },
  { value: '36-45', label: '36-45 years' },
  { value: '46-60', label: '46-60 years' },
  { value: '60+', label: '60+ years' }
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    ageRange: '',
    occupation: '',
    locality: '',
    monthlyIncome: undefined
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load existing profile if available
    const existingProfile = storage.getProfile();
    if (existingProfile) {
      setProfile(existingProfile);
    }
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profile.ageRange) {
      newErrors.ageRange = 'Please select your age range';
    }

    if (!profile.occupation) {
      newErrors.occupation = 'Please select your occupation';
    }

    if (!profile.locality.trim()) {
      newErrors.locality = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      storage.saveProfile(profile);
      storage.saveProgress('profile-complete', profile);
      navigate('/documents');
    }
  };

  const handleBack = () => {
    navigate('/consent');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={40} className="h-2" />
        </div>
        <span className="text-sm text-muted-foreground">2/5</span>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="mobile-title text-foreground mb-2">
              {i18n.t('profileTitle')}
            </h1>
            <p className="text-muted-foreground">
              Help us understand your profile better
            </p>
          </div>

          {/* Form */}
          <Card className="card-soft">
            <CardContent className="p-6 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  {i18n.t('yourName')} *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={i18n.t('namePlaceholder')}
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`mobile-button h-12 ${errors.name ? 'border-destructive' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Age Range */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium">
                  {i18n.t('ageRange')} *
                </Label>
                <Select
                  value={profile.ageRange}
                  onValueChange={(value) => handleInputChange('ageRange', value)}
                >
                  <SelectTrigger className={`mobile-button h-12 ${errors.ageRange ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ageRange && (
                  <p className="text-sm text-destructive">{errors.ageRange}</p>
                )}
              </div>

              {/* Occupation */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium">
                  {i18n.t('occupation')} *
                </Label>
                <Select
                  value={profile.occupation}
                  onValueChange={(value) => handleInputChange('occupation', value)}
                >
                  <SelectTrigger className={`mobile-button h-12 ${errors.occupation ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">{i18n.t('occupations.farmer')}</SelectItem>
                    <SelectItem value="shopkeeper">{i18n.t('occupations.shopkeeper')}</SelectItem>
                    <SelectItem value="driver">{i18n.t('occupations.driver')}</SelectItem>
                    <SelectItem value="worker">{i18n.t('occupations.worker')}</SelectItem>
                    <SelectItem value="teacher">{i18n.t('occupations.teacher')}</SelectItem>
                    <SelectItem value="other">{i18n.t('occupations.other')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.occupation && (
                  <p className="text-sm text-destructive">{errors.occupation}</p>
                )}
              </div>

              {/* Monthly Income (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="income" className="text-foreground font-medium">
                  {i18n.t('monthlyIncome')}
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="income"
                    type="number"
                    placeholder={i18n.t('incomePlaceholder')}
                    value={profile.monthlyIncome || ''}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="mobile-button h-12 pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This helps us provide better loan estimates
                </p>
              </div>

              {/* Locality */}
              <div className="space-y-2">
                <Label htmlFor="locality" className="text-foreground font-medium">
                  {i18n.t('locality')} *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="locality"
                    type="text"
                    placeholder={i18n.t('localityPlaceholder')}
                    value={profile.locality}
                    onChange={(e) => handleInputChange('locality', e.target.value)}
                    className={`mobile-button h-12 pl-10 ${errors.locality ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.locality && (
                  <p className="text-sm text-destructive">{errors.locality}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="mobile-button w-full gradient-primary text-primary-foreground hover:opacity-90"
          >
            {i18n.t('continue')}
          </Button>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              * Required fields. All information is stored locally on your device.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};