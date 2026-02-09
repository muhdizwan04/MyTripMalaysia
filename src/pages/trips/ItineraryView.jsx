import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { MOCK_ACTIVITIES } from '../../lib/constants';
import { Clock, MapPin, DollarSign, Loader2, ArrowLeft } from 'lucide-react';

export default function ItineraryView() {
    const location = useLocation();
    const navigate = useNavigate();
    const tripData = location.state || {}; // Expecting trip data passed from CreateTrip

    const [isLoading, setIsLoading] = useState(true);
    const [itinerary, setItinerary] = useState([]);

    useEffect(() => {
        // Simulate AI generation
        const generateItinerary = () => {
            setTimeout(() => {
                const days = tripData.duration || 3;
                const generated = [];

                for (let i = 1; i <= days; i++) {
                    // Shuffle mock activities for variety
                    const dailyActivities = [...MOCK_ACTIVITIES].sort(() => 0.5 - Math.random()).slice(0, 4);
                    generated.push({
                        day: i,
                        activities: dailyActivities
                    });
                }
                setItinerary(generated);
                setIsLoading(false);
            }, 3000); // 3 seconds delay for "AI" to think
        };

        generateItinerary();
    }, [tripData]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-2xl font-bold">Generating your perfect trip...</h2>
                <p className="text-muted-foreground mt-2">AI is analyzing {tripData.destination || 'locations'} to find the best spots for you.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Planning
                </Button>
                <h1 className="text-2xl font-bold">{tripData.destination || 'Unknown'} Trip</h1>
            </div>

            <div className="grid gap-6">
                {itinerary.map((day) => (
                    <Card key={day.day}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Day {day.day}</span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    {new Date(new Date(tripData.startDate).setDate(new Date(tripData.startDate).getDate() + day.day - 1)).toDateString()}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l border-muted ml-3 space-y-8">
                                {day.activities.map((activity, index) => (
                                    <div key={index} className="mb-8 ml-6 relative">
                                        <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-[37px] ring-4 ring-background">
                                            <Clock className="w-3 h-3 text-primary-foreground" />
                                        </span>
                                        <div className="p-4 bg-accent/20 rounded-lg border">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-lg">{activity.name}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${activity.type === 'food' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {activity.type}
                                                </span>
                                            </div>
                                            <div className="flex gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {activity.time} ({activity.duration}h)</span>
                                                <span className="flex items-center"><DollarSign className="w-3 h-3 mr-1" /> RM {activity.cost}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 flex justify-center gap-4">
                <Button variant="outline">Save Draft</Button>
                <Button>Confirm Itinerary</Button>
            </div>
        </div>
    );
}
