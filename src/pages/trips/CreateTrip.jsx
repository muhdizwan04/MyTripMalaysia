import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { MALAYSIA_LOCATIONS, MOCK_HOTELS } from '../../lib/constants';
import { MapPin, Calendar, Users, Wallet, Bus, Car, Building2, Star } from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Destination' },
    { id: 2, title: 'Trip Details' },
    { id: 3, title: 'Travel Style' },
    { id: 4, title: 'Accommodation' },
    { id: 5, title: 'Review' },
];

export default function CreateTrip() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        state: '',
        destination: '',
        startDate: '',
        duration: 1,
        pax: 1,
        budget: '',
        travelStyle: '',
        transport: '',
        accommodation: null
    });

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">State (Negeri)</label>
                    <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData.state}
                        onChange={(e) => {
                            updateFormData('state', e.target.value);
                            updateFormData('destination', ''); // Reset destination when state changes
                        }}
                    >
                        <option value="">Select State</option>
                        {MALAYSIA_LOCATIONS.map(loc => (
                            <option key={loc.state} value={loc.state}>{loc.state}</option>
                        ))}
                    </select>
                </div>

                {formData.state && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Destination</label>
                        <select
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            value={formData.destination}
                            onChange={(e) => updateFormData('destination', e.target.value)}
                        >
                            <option value="">Select Destination</option>
                            {MALAYSIA_LOCATIONS.find(l => l.state === formData.state)?.destinations.map(dest => (
                                <option key={dest} value={dest}>{dest}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateFormData('startDate', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Number of Days</label>
                    <Input
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={(e) => updateFormData('duration', parseInt(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Group Size</label>
                    <Input
                        type="number"
                        min="1"
                        value={formData.pax}
                        onChange={(e) => updateFormData('pax', parseInt(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Budget (Total RM)</label>
                    <Input
                        type="number"
                        placeholder="e.g. 1000"
                        value={formData.budget}
                        onChange={(e) => updateFormData('budget', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-4">Travel Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Relax', 'Adventure', 'Foodie', 'Mixed'].map(style => (
                        <div
                            key={style}
                            className={`p-4 border rounded-lg cursor-pointer text-center hover:border-primary transition-colors ${formData.travelStyle === style ? 'border-primary bg-primary/5' : ''}`}
                            onClick={() => updateFormData('travelStyle', style)}
                        >
                            {style}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-4">Transportation</label>
                <div className="grid grid-cols-2 gap-4">
                    <div
                        className={`p-4 border rounded-lg cursor-pointer flex items-center justify-center gap-2 hover:border-primary transition-colors ${formData.transport === 'car' ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => updateFormData('transport', 'car')}
                    >
                        <Car className="h-5 w-5" /> Own Car
                    </div>
                    <div
                        className={`p-4 border rounded-lg cursor-pointer flex items-center justify-center gap-2 hover:border-primary transition-colors ${formData.transport === 'public' ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => updateFormData('transport', 'public')}
                    >
                        <Bus className="h-5 w-5" /> Public Transport
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_HOTELS.map(hotel => (
                    <div
                        key={hotel.id}
                        className={`border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-all ${formData.accommodation?.id === hotel.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
                        onClick={() => updateFormData('accommodation', hotel)}
                    >
                        <div className="h-32 bg-muted relative">
                            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold">{hotel.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" /> {hotel.location}
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="font-bold text-primary">RM {hotel.price}/night</span>
                                <span className="flex items-center text-sm"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" /> {hotel.rating}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Destination:</strong> {formData.destination}, {formData.state}</p>
                <p><strong>Date:</strong> {formData.startDate} ({formData.duration} days)</p>
                <p><strong>Group Size:</strong> {formData.pax} pax</p>
                <p><strong>Budget:</strong> RM {formData.budget}</p>
                <p><strong>Style:</strong> {formData.travelStyle}</p>
                <p><strong>Transport:</strong> {formData.transport === 'car' ? 'Own Car' : 'Public Transport'}</p>
                <p><strong>Accommodation:</strong> {formData.accommodation ? `${formData.accommodation.name} (RM ${formData.accommodation.price}/night)` : 'Not selected'}</p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
                Ready to generate your itinerary? Our AI will plan the perfect trip for you.
            </p>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    {STEPS.map((step) => (
                        <span key={step.id} className={`text-xs sm:text-sm font-medium ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'} ${currentStep === step.id ? 'font-bold' : ''}`}>
                            {step.title}
                        </span>
                    ))}
                </div>
                <div className="h-2 bg-secondary rounded-full">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {currentStep === 1 && "Where do you want to go?"}
                        {currentStep === 2 && "Trip Details"}
                        {currentStep === 3 && "How do you want to travel?"}
                        {currentStep === 4 && "Choose Accommodation"}
                        {currentStep === 5 && "Review & Generate"}
                    </CardTitle>
                    <CardDescription>
                        {currentStep === 1 && "Choose your perfect Malaysian getaway."}
                        {currentStep === 2 && "Tell us when and who you're traveling with."}
                        {currentStep === 3 && "Select your preferred travel style and transport."}
                        {currentStep === 4 && "Select a place to stay. This will be your starting point."}
                        {currentStep === 5 && "Review your trip details before we work our magic."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                    {currentStep === 5 && renderStep5()}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={currentStep === STEPS.length ? () => navigate('/trips/itinerary', { state: formData }) : handleNext}
                        disabled={
                            (currentStep === 1 && (!formData.state || !formData.destination)) ||
                            (currentStep === 2 && (!formData.startDate || !formData.budget)) ||
                            (currentStep === 3 && (!formData.travelStyle || !formData.transport)) ||
                            (currentStep === 4 && !formData.accommodation)
                        }
                    >
                        {currentStep === STEPS.length ? 'Generate Itinerary' : 'Next'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
