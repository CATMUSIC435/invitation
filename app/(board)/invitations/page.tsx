import InvitationCardSale from "@/components/atoms/invitation-card-sale";

export default function Page() {
    return (
        <main className="p-4">
            <div className="mt-10 mb-8 text-center">
                <h1 className="flex items-center justify-center gap-4 mx-auto text-xl md:text-4xl font-bold mb-1 text-center bg-gradient-to-r from-[#844d15] to-[#844d15] bg-clip-text text-transparent" style={{ fontFamily: 'SVN Avo bold'}}>
                    THƯ MỜI DXMD VIETNAM <br />MAGIC NIGHT <br /> POOL PARTY
                </h1>
            </div>
            <InvitationCardSale />
        </main>
    );
}
