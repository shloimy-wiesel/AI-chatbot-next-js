"use client";
import { useOnborda } from "onborda";
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Page() {

    const { startOnborda } = useOnborda();

    const handleStartOnborda = () => {
        startOnborda('1');
    };



    return (
        <>
            <Button size="lg" onClick={handleStartOnborda}>
                <Sparkles size={16} className="mr-2" /> Start the tour
            </Button>
            <div id="#onborda-step1" className="mt-10">
                <Button size="lg" onClick={() => console.log("hello")}>
                    <Sparkles size={16} className="mr-2" /> Start the tour
                </Button>
            </div>
        </>
    );




}
