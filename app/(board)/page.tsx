import InvitationCard from "@/components/atoms/invitation-card";

export default function Page() {
    return (
        <main className="p-4">
            <div className="mt-14 md:mt-10 mb-8 text-center">
                <h1 className="flex items-center justify-center gap-4 mx-auto text-xl md:text-4xl font-bold mb-1 text-center bg-gradient-to-r from-[#844d15] to-[#844d15] bg-clip-text text-transparent" style={{ fontFamily: 'SVN Avo bold'}}>
                    THƯ MỜI <br />DXMD VIETNAM AWARD 2025
                </h1>
            </div>
            <InvitationCard />
        </main>
    );
}
