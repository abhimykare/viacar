import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import NavBar from "./nav-bar";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface HeaderProps {
  title?: string;
  breadcrumb?: BreadcrumbItem[];
}

export default function Header({ title = "", breadcrumb = [] }: HeaderProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <nav
      className={cn(
        "grid grid-cols-1 grid-rows-[minmax(auto,_275px)]",
        isRTL && "[direction:rtl]"
      )}
    >
      <img
        className="col-start-1 -col-end-1 row-start-1 -row-end-1 z-0 w-full h-full object-cover"
        src="/assets/hero.png"
        alt=""
      />
      <div className="col-start-1 -col-end-1 row-start-1 -row-end-1 z-10 max-w-[1410px] w-full h-max mx-auto px-6 flex flex-col">
        <NavBar />
        <div className="flex flex-col gap-2 mb-[44px]">
          <h1
            className={cn(
              "max-w-max w-full text-3xl lg:text-[2.8rem] font-medium mx-auto text-white text-center pt-12 lg:pt-2",
              isRTL && "text-right lg:text-right"
            )}
          >
            {title}
          </h1>
          <div
            className={cn(
              "flex items-center justify-center",
              isRTL && "flex-row-reverse"
            )}
          >
            {breadcrumb?.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList className={cn("justify-center")}>
                  {breadcrumb.map((item, index) => (
                    <BreadcrumbItem key={index}>
                      {index !== breadcrumb.length - 1 ? (
                        <>
                          <BreadcrumbLink
                            className="text-sm text-white hover:text-white/80"
                            asChild
                          >
                            <Link to={item.href}>{item.label}</Link>
                          </BreadcrumbLink>
                          <BreadcrumbSeparator
                            className={cn(
                              "[&_svg]:stroke-white",
                              isRTL && "[&_svg]:rotate-180"
                            )}
                          />
                        </>
                      ) : (
                        <BreadcrumbPage className="text-sm text-[#FF7777]">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
