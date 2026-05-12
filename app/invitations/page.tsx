import InvitationCard from "@/components/atoms/invitation-card";
import ShinyText from "@/components/atoms/shiny-text";

export default function Page() {
  return (
    <main className="p-4 min-h-screen flex flex-col items-center justify-center">
      <div className="mt-8 mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-2 text-center tracking-tight text-white uppercase">
          Thư Mời
          <br />
          <span className="text-base md:text-3xl mt-3 block font-medium tracking-[0.2em] text-[#c19d68] items-center">
            CUỘC THI “SĂN VÉ LÊN TÀU CÙNG <ShinyText text="FENICA" color="#c19d68" shineColor="#ffffff" speed={2} className="text-4xl md:text-6xl font-black inline-block ml-2 align-middle drop-shadow-[0_0_15px_rgba(193,157,104,0.6)] [-webkit-text-stroke:1px_rgba(255,255,255,0.4)]" />”
          </span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-xs text-sm font-light">
          Tạo thiệp mời cá nhân hóa của bạn bằng cách tải ảnh đại diện và nhập thông tin bên dưới.
        </p>
      </div>
      <InvitationCard />
    </main>
  );
}
