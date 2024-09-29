import React from 'react';
import { NavBar } from '@components/layouts/dashboard/components/nav-bar/NavBar';

interface LayoutProps {
    header: React.ReactNode;
    leftPanel: React.ReactNode;
    rightPanel: React.ReactNode;
}

export const DashboardLayout: React.FC<LayoutProps> = ({ header, leftPanel, rightPanel }) => {
    return (
        <main className="flex w-full h-full bg-primary">
            <NavBar />
            <div className="flex flex-col p-6 h-screen w-full overflow-auto">
                <header className="flex gap-6">
                    <div className="flex-1 px-5 pb-10 min-w-[800px] md:min-w-[500px]">
                        {header}
                    </div>
                    <div className="flex-1 min-w-[260px] md:max-w-[400px]" />
                </header>
                <div className="flex gap-6 h-full">
                    <section className="flex-1 h-full bg-black-3 border border-grey-3 rounded-lg min-w-[500px] md:min-w-[500px]">
                        {leftPanel}
                    </section>
                    <section className="flex-1 h-full bg-black-3 border border-grey-3 rounded-lg min-w-[260px]">
                        {rightPanel}
                    </section>
                </div>
            </div>
        </main>
    );
};