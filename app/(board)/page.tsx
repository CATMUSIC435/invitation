import InvitationCard from "@/components/atoms/invitation-card";

export default function Page() {
  return (
    <main className="p-4 min-h-screen flex flex-col items-center justify-center">
      <div className="mt-8 mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-6xl font-extrabold mb-2 text-center tracking-tight text-white uppercase">
          Thư Mời
          <br />
          <span className="text-xl md:text-3xl mt-3 block font-medium tracking-[0.2em] text-[#c19d68]">
            CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA”
          </span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base font-light">
          Tạo thiệp mời cá nhân hóa của bạn bằng cách tải ảnh đại diện và nhập thông tin bên dưới.
        </p>
      </div>
      <InvitationCard />
    </main>
  );
}
