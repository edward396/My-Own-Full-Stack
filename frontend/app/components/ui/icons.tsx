import React from "react";
import {
  HiOutlineShoppingCart,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineCube,
  HiOutlineTruck,
  HiOutlineMagnifyingGlass,
  HiOutlineStar,
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineBuildingStorefront,
  HiOutlineShieldCheck,
  HiOutlineQuestionMarkCircle,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineArrowTrendingUp,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineEyeSlash,
  HiOutlineArrowUpTray,
  HiOutlineInformationCircle,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineChevronRight,
  HiOutlineCog6Tooth,
  HiOutlineArrowRight,
  HiOutlineUserPlus,
  HiOutlineCreditCard,
} from "react-icons/hi2";

// App-wide icon aliases (monochrome, outline style)
export const ShoppingCart = HiOutlineShoppingCart;
export const ShoppingBag = HiOutlineShoppingBag;
export const User = HiOutlineUser;
export const Package = HiOutlineCube;
export const Truck = HiOutlineTruck;
export const Search = HiOutlineMagnifyingGlass;
export const Star = HiOutlineStar;
export const ArrowLeft = HiOutlineArrowLeft;
export const Plus = HiOutlinePlus;
export const Minus = HiOutlineMinus;
export const Store = HiOutlineBuildingStorefront;
export const Shield = HiOutlineShieldCheck;
export const HelpCircle = HiOutlineQuestionMarkCircle;
export const Mail = HiOutlineEnvelope;
export const Phone = HiOutlinePhone;
export const MessageSquare = HiOutlineChatBubbleLeftRight;
export const Eye = HiOutlineEye;
export const Edit = HiOutlinePencilSquare;
export const Trash2 = HiOutlineTrash;
export const TrendingUp = HiOutlineArrowTrendingUp;
export const MapPin = HiOutlineMapPin;
export const Clock = HiOutlineClock;
export const CheckCircle = HiOutlineCheckCircle;
export const XCircle = HiOutlineXCircle;
export const LogIn = HiOutlineArrowRightOnRectangle;
export const EyeOff = HiOutlineEyeSlash;
export const Upload = HiOutlineArrowUpTray;
export const Info = HiOutlineInformationCircle;
export const Settings = HiOutlineCog6Tooth;
export const ArrowRight = HiOutlineArrowRight;
export const UserPlus = HiOutlineUserPlus;
export const CreditCard = HiOutlineCreditCard;

// shadcn ui helper icon names
export const CheckIcon = HiOutlineCheck;
export const ChevronDownIcon = HiOutlineChevronDown;
export const ChevronUpIcon = HiOutlineChevronUp;
export const ChevronRightIcon = HiOutlineChevronRight;
// No outline circle in hi2; use CheckCircle for radio indicators fallback
export const CircleIcon = HiOutlineCheckCircle;

export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
