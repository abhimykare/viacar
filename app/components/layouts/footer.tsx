import { NavLink } from "react-router";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-black">
      <div className="pt-[40px] max-w-[1410px] w-full mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 lg:mb-12">
          <img
            className="h-[50px] lg:h-[84px] max-md:mb-6"
            src="/assets/logo-white.png"
            alt=""
          />
          <div className="flex items-center gap-[40px]">
            <div className="flex items-center gap-2">
              <img src="/assets/fb.svg" alt="" />
              <p className="text-[14px] text-white max-md:hidden">Facebook</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/x.svg" alt="" />
              <p className="text-[14px] text-white max-md:hidden">Twitter</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/linkedin.svg" alt="" />
              <p className="text-[14px] text-white max-md:hidden">LinkedIn</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/instagram.svg" alt="" />
              <p className="text-[14px] text-white max-md:hidden">Instagram</p>
            </div>
          </div>
        </div>
        <Separator className="opacity-20" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-2 lg:gap-5 pt-8 lg:pt-[50px]">
          <div>
            <p className="lg:max-w-[250px] text-white text-3xl lg:text-[40px] font-extralight leading-12 mb-8 lg:mb-12 text-center md:text-start max-md:mx-auto">
              {t("layout.footer.download_app")}
            </p>
            <div className="flex flex-col md:flex-row flex-wrap items-center gap-3.5 mb-10 lg:mb-24">
              <NavLink to="/">
                <img src="/assets/google-play.svg" />
              </NavLink>
              <NavLink to="/">
                <img src="/assets/app-store.svg" />
              </NavLink>
            </div>
          </div>
          <div>
            <NavLink
              to="/"
              className="text-white text-3xl lg:text-[40px] font-extralight max-w-[370px] block leading-12 mb-8 lg:mb-12 max-md:text-center max-lg:mx-auto"
            >
              {t("layout.footer.get_in_touch")} <br className="lg:hidden" />
              <span className="text-white font-extralight underline">
                {" "}
                {t("layout.footer.contact")}
              </span>
            </NavLink>
            <div className="flex max-md:flex-wrap items-center justify-center md:justify-start lg:justify-between gap-5">
              <a
                className="border border-white/10 rounded-full h-[53px] px-6 flex items-center justify-center text-white text-[17px]"
                href="tel:"
              >
                +966 1234567890
              </a>
              <a
                className="border border-white/10 rounded-full h-[53px] px-6 flex items-center justify-center text-white text-[17px]"
                href="mailto:"
              >
                info@democompany.com
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-start gap-4 mx-auto max-md:my-4">
            <p className="text-[23px] text-white">
              {t("layout.footer.quick_links")}
            </p>
            <a className="text-[18px] font-extralight text-white" href="/">
              {t("layout.footer.how_it_works")}
            </a>
            <a className="text-[18px] font-extralight text-white" href="/">
              {t("layout.footer.about_us")}
            </a>
            <a className="text-[18px] font-extralight text-white" href="/">
              {t("layout.footer.help_center")}
            </a>
            <a className="text-[18px] font-extralight text-white" href="/">
              {t("layout.footer.privacy_policy")}
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center p-4 bg-[#141414] text-base text-center text-white">
          {t("layout.footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
