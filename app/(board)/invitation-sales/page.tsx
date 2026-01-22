import { Instructions } from "@/components/atoms/instructions";
import InvitationCardSale from "@/components/atoms/invitation-card-sale";

export default function Page() {
    return (
        <main className="p-4">
            <div className="mb-4 text-center">
                <h1 className="flex items-center justify-center gap-4 mx-auto text-4xl font-serif font-bold mb-1 text-center bg-gradient-to-r from-cyan-500 to-pink-500 bg-clip-text text-transparent">THIỆP MỜI</h1>
                <Instructions />
            </div>
            <InvitationCardSale />
        </main>
    );
}
