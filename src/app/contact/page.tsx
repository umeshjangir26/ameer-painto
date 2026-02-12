"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  SendIcon,
  CheckIcon,
  UserIcon,
  MessageSquareIcon,
  SparklesIcon,
  GlobeIcon,
  AlertCircleIcon,
} from "lucide-react";
import {
  MaxWidthWrapper,
  AnimationContainer,
  Navbar,
  Footer,
} from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import { cn } from "@/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/app/hooks/useTranslations";

/* ─────────────────────────
   ENHANCED DATA FUNCTIONS WITH TRANSLATIONS
────────────────────────── */

const getContactInfo = (t: any, loading: boolean) => ({
  phone: "+972 52-525-4000",
  email: "Support@painto.co.il",
  address: loading
    ? "Tel Aviv-Yafo, Israel"
    : t("contact.info.address", "Tel Aviv-Yafo, Israel"),
  hours: loading
    ? "Sunday - Thursday: 8:00 - 18:00"
    : t("contact.info.hours", "Sunday - Thursday: 8:00 - 18:00"),
});

const getContactMethods = (t: any, loading: boolean) => [
  // {
  //   icon: PhoneIcon,
  //   title: loading ? "Call Us Directly" : t('contact.methods.phone.title', 'Call Us Directly'),
  //   description: loading ? "Speak with our experts immediately" : t('contact.methods.phone.description', 'Speak with our experts immediately'),
  //   value: "+972-52-555-1234",
  //   action: "call",
  //   color: "from-green-500 to-emerald-600",
  //   bgColor: "bg-green-50",
  //   textColor: "text-green-700"
  // },
  {
    icon: MailIcon,
    title: loading
      ? "Email Support"
      : t("contact.methods.email.title", "Email Support"),
    description: loading
      ? "Send us detailed inquiries"
      : t("contact.methods.email.description", "Send us detailed inquiries"),
    value: "",
    action: "email",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    icon: MessageSquareIcon,
    title: loading
      ? "WhatsApp Chat"
      : t("contact.methods.whatsapp.title", "WhatsApp Chat"),
    description: loading
      ? "Quick chat with instant responses"
      : t(
          "contact.methods.whatsapp.description",
          "Quick chat with instant responses",
        ),
    value: loading
      ? "WhatsApp Business"
      : t("contact.methods.whatsapp.value", "WhatsApp Business"),
    action: "whatsapp",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Translation and RTL support
  const { currentLang, isRTL, isLoading: langLoading } = useLanguage();
  const { t, loading: translationLoading } = useTranslations(currentLang);
  const loading = langLoading || translationLoading;

  // Get dynamic data with translations
  const CONTACT_INFO = getContactInfo(t, loading);
  const CONTACT_METHODS = getContactMethods(t, loading);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitFormData = new FormData(); // ← Different variable name

      // Add all form fields to FormData (accessing from your state)
      submitFormData.append("name", formData.name); // ← Now accessing from state
      submitFormData.append("email", formData.email);
      submitFormData.append("phone", formData.phone);
      submitFormData.append("subject", formData.subject);
      submitFormData.append("message", formData.message);

      // Optional: Add custom subject and additional fields
      submitFormData.append(
        "_subject",
        `New Contact Form Submission from ${formData.name}`, // ← From state
      );
      submitFormData.append("_captcha", "false");
      submitFormData.append("_next", window.location.href);
      submitFormData.append("_template", "table");

      const response = await fetch(
        "https://formsubmit.co/Support@painto.co.il",
        {
          method: "POST",
          body: submitFormData, // ← Using FormData object
        },
      );

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
        }, 3000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactAction = (action: string, value: string) => {
    switch (action) {
      case "call":
        window.open(`tel:${value}`);
        break;
      case "email":
        window.open(`mailto:${value}`);
        break;
      case "whatsapp":
        const message = loading
          ? "שלום! אני מעוניין/ת במוצרי סופר. האם תוכלו לעזור לי?"
          : t(
              "contact.whatsappMessage",
              "שלום! אני מעוניין/ת במוצרי סופר. האם תוכלו לעזור לי?",
            );
        window.open(
          `https://wa.me/972525254000?text=${encodeURIComponent(message)}`,
          "_blank",
        );
        break;
    }
  };

  return (
    <div className={cn("min-h-screen bg-background", isRTL && "rtl")}>
      <Navbar />
      <MaxWidthWrapper className="py-20">
        {/* ══════════════════════════════════════════
            🎯 HERO SECTION - Enhanced with RTL
        ══════════════════════════════════════════ */}
        <AnimationContainer
          className={cn("text-center mb-20", isRTL && "rtl:text-right")}
        >
          <div className="flex justify-center mb-6">
            {/* ✅ Wrapper added for centering */}
            <div className="relative inline-flex h-8 overflow-hidden rounded-full p-[1.5px] focus:outline-none select-none">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#6d28d9_0%,#d8b4fe_50%,#6d28d9_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                {loading ? "Contact Us" : t("contact.badge", "Contact Us")}
              </span>
            </div>
          </div>
          {/* 
          <MagicBadge
            title={loading ? "Contact Us" : t("contact.badge", "Contact Us")}
          /> */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-whitetext mt-6 mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block">
              {loading
                ? "Let's Connect and"
                : t("contact.hero.title", "Let's Connect and")}
            </span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {loading
                ? "Build Something Great"
                : t("contact.hero.subtitle", "Build Something Great")}
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {loading ? (
              <>
                Have questions about our professional adhesive solutions? Need
                technical support? Our expert team is here to help you choose
                the right products for your project.
              </>
            ) : (
              t(
                "contact.hero.description",
                "Have questions about our professional adhesive solutions? Need technical support? Our expert team is here to help you choose the right products for your project.",
              )
            )}
          </motion.p>
        </AnimationContainer>

        {/* ══════════════════════════════════════════
            📝 MAIN CONTENT GRID - Form & Info
        ══════════════════════════════════════════ */}
        <div
          className={cn(
            "grid lg:grid-cols-12 gap-12",
            isRTL && "lg:grid-cols-12 rtl:space-x-reverse",
          )}
        >
          {/* CONTACT FORM - Enhanced with RTL */}
          <div className="lg:col-span-8">
            <AnimationContainer delay={0.8}>
              <MagicCard className="p-8 bg-card">
                <div className={cn("mb-8", isRTL && "rtl:text-right")}>
                  <h2 className="text-3xl font-bold text-whitetext mb-4">
                    {loading
                      ? "Send Us a Message"
                      : t("contact.form.title", "Send Us a Message")}
                  </h2>
                  <p className="text-muted-foreground">
                    {loading
                      ? "Fill out the form below and we'll get back to you within 24 hours."
                      : t(
                          "contact.form.description",
                          "Fill out the form below and we'll get back to you within 24 hours.",
                        )}
                  </p>
                </div>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Name and Email Row */}
                  <div
                    className={cn(
                      "grid md:grid-cols-2 gap-6",
                      isRTL && "md:rtl:grid-cols-2 rtl:space-x-reverse",
                    )}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <label
                        className={cn(
                          "block text-sm font-semibold text-whitetext mb-2",
                          isRTL && "rtl:text-right",
                        )}
                      >
                        <UserIcon className="w-4 h-4 inline me-2" />
                        {loading
                          ? "Full Name *"
                          : t("contact.form.fields.name", "Full Name *")}
                      </label>

                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={
                          loading
                            ? "Your full name"
                            : t(
                                "contact.form.placeholders.name",
                                "Your full name",
                              )
                        }
                        required
                        className={cn(
                          "h-12",
                          isRTL && "rtl:text-right rtl:placeholder:text-right",
                        )}
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 }}
                    >
                      <label
                        className={cn(
                          "block text-sm font-semibold text-whitetext mb-2",
                          isRTL && "rtl:text-right",
                        )}
                      >
                        <MailIcon className="w-4 h-4 inline me-2" />
                        {loading
                          ? "Email Address *"
                          : t("contact.form.fields.email", "Email Address *")}
                      </label>

                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={
                          loading
                            ? "your.email@example.com"
                            : t(
                                "contact.form.placeholders.email",
                                "your.email@example.com",
                              )
                        }
                        required
                        className={cn(
                          "h-12",
                          isRTL && "rtl:text-right rtl:placeholder:text-right",
                        )}
                        dir="ltr"
                      />
                    </motion.div>
                  </div>

                  {/* Phone and Subject Row */}
                  <div
                    className={cn(
                      "grid md:grid-cols-2 gap-6",
                      isRTL && "md:rtl:grid-cols-2 rtl:space-x-reverse",
                    )}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <label
                        className={cn(
                          "block text-sm font-semibold text-whitetext mb-2",
                          isRTL && "rtl:text-right",
                        )}
                      >
                        <PhoneIcon className="w-4 h-4 inline me-2" />
                        {loading
                          ? "Phone Number"
                          : t("contact.form.fields.phone", "Phone Number")}
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={
                          loading
                            ? "+972-XX-XXX-XXXX"
                            : t(
                                "contact.form.placeholders.phone",
                                "+972-XX-XXX-XXXX",
                              )
                        }
                        className="h-12"
                        dir="ltr" // Phone always LTR
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 }}
                    >
                      <label
                        className={cn(
                          "block text-sm font-semibold text-whitetext mb-2",
                          isRTL && "rtl:text-right",
                        )}
                      >
                        <MessageSquareIcon className="w-4 h-4 inline me-2" />
                        {loading
                          ? "Subject"
                          : t("contact.form.fields.subject", "Subject")}
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={
                          loading
                            ? "How can we help you?"
                            : t(
                                "contact.form.placeholders.subject",
                                "How can we help you?",
                              )
                        }
                        className={cn(
                          "h-12",
                          isRTL && "rtl:text-right rtl:placeholder:text-right",
                        )}
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                    </motion.div>
                  </div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <label
                      className={cn(
                        "block text-sm font-semibold text-whitetext mb-2",
                        isRTL && "rtl:text-right",
                      )}
                    >
                      <MessageSquareIcon className="w-4 h-4 inline me-2" />
                      {loading
                        ? "Message *"
                        : t("contact.form.fields.message", "Message *")}
                    </label>

                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={
                        loading
                          ? "Tell us about your project or question in detail..."
                          : t(
                              "contact.form.placeholders.message",
                              "Tell us about your project or question in detail...",
                            )
                      }
                      required
                      rows={6}
                      className={cn(
                        "resize-none",
                        isRTL && "rtl:text-right rtl:placeholder:text-right",
                      )}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting || isSubmitted}
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin me-3" />
                          {loading
                            ? "Sending Message..."
                            : t("contact.form.sending", "Sending Message...")}
                        </>
                      ) : isSubmitted ? (
                        <>
                          <CheckIcon className={cn("w-5 h-5 me-3")} />
                          {loading
                            ? "Message Sent Successfully!"
                            : t(
                                "contact.form.success",
                                "Message Sent Successfully!",
                              )}
                        </>
                      ) : (
                        <>
                          <SendIcon
                            className={cn(
                              "w-5 h-5 me-3 transition-transform",
                              isRTL
                                ? "group-hover:-translate-x-1"
                                : "group-hover:translate-x-1",
                            )}
                          />
                          {loading
                            ? "Send Message"
                            : t("contact.form.submit", "Send Message")}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </MagicCard>
            </AnimationContainer>
          </div>

          {/* CONTACT INFORMATION - Enhanced with RTL */}
          <div className="lg:col-span-4">
            <AnimationContainer delay={1.0}>
              <div className="space-y-8">
                {/* Contact Details */}
                <MagicCard className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5">
                  <h3
                    className={cn(
                      "text-2xl font-bold text-whitetext mb-6",
                      isRTL && "rtl:text-right",
                    )}
                  >
                    {loading
                      ? "Contact Information"
                      : t("contact.info.title", "Contact Information")}
                  </h3>

                  <div className="space-y-6">
                    <motion.div
                      className={cn(
                        "flex items-start gap-4 p-4 bg-background/50 rounded-xl",
                        isRTL && "rtl:flex-row-reverse",
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="bg-green-100 p-3 rounded-lg">
                        <PhoneIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div className={cn("flex-1", isRTL && "rtl:text-right")}>
                        <h4 className="font-semibold text-whitetext mb-1">
                          {loading
                            ? "Phone"
                            : t("contact.info.phone.title", "Phone")}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-2">
                          {loading
                            ? "Call us directly"
                            : t(
                                "contact.info.phone.description",
                                "Call us directly",
                              )}
                        </p>
                        <a
                          href={`tel:${CONTACT_INFO.phone}`}
                          className="text-green-600 font-semibold hover:underline"
                          dir="ltr"
                        >
                          {CONTACT_INFO.phone}
                        </a>
                      </div>
                    </motion.div>

                    <motion.div
                      className={cn(
                        "flex items-start gap-4 p-4 bg-background/50 rounded-xl",
                        isRTL && "rtl:flex-row-reverse",
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <MailIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className={cn("flex-1", isRTL && "rtl:text-right")}>
                        <h4 className="font-semibold text-whitetext mb-1">
                          {loading
                            ? "Email"
                            : t("contact.info.email.title", "Email")}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-2">
                          {loading
                            ? "Send us an email"
                            : t(
                                "contact.info.email.description",
                                "Send us an email",
                              )}
                        </p>
                        <a
                          href={`mailto:${CONTACT_INFO.email}`}
                          className="text-blue-600 font-semibold hover:underline"
                          dir="ltr"
                        >
                          {CONTACT_INFO.email}
                        </a>
                      </div>
                    </motion.div>

                    {/* <motion.div
                      className={cn(
                        "flex items-start gap-4 p-4 bg-background/50 rounded-xl",
                        isRTL && "rtl:flex-row-reverse"
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <MapPinIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className={cn("flex-1", isRTL && "rtl:text-right")}>
                        <h4 className="font-semibold text-whitetext mb-1">
                          {loading
                            ? "Location"
                            : t("contact.info.location.title", "Location")}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-2">
                          {loading
                            ? "Visit our office"
                            : t(
                                "contact.info.location.description",
                                "Visit our office"
                              )}
                        </p>
                        <p className="text-purple-600 font-semibold">
                          {CONTACT_INFO.address}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className={cn(
                        "flex items-start gap-4 p-4 bg-background/50 rounded-xl",
                        isRTL && "rtl:flex-row-reverse"
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <ClockIcon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className={cn("flex-1", isRTL && "rtl:text-right")}>
                        <h4 className="font-semibold text-whitetext mb-1">
                          {loading
                            ? "Business Hours"
                            : t("contact.info.hours.title", "Business Hours")}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-2">
                          {loading
                            ? "When we're available"
                            : t(
                                "contact.info.hours.description",
                                "When we're available"
                              )}
                        </p>
                        <p className="text-orange-600 font-semibold text-sm">
                          {CONTACT_INFO.hours}
                        </p>
                      </div>
                    </motion.div> */}
                  </div>
                </MagicCard>
              </div>
            </AnimationContainer>
          </div>
        </div>
      </MaxWidthWrapper>
      {/* 📞 QUICK CONTACT METHODS - Enhanced with RTL */}
      <AnimationContainer delay={0.4} className="mb-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-screen-xl">
          <div
            className={cn(
              "grid md:grid-cols-3 gap-8 items-stretch",
              isRTL && "rtl:space-x-reverse",
            )}
          >
            {CONTACT_METHODS.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
                onClick={() => handleContactAction(method.action, method.value)}
              >
                <MagicCard className="p-8 h-full bg-card hover:shadow-2xl transition-all duration-300">
                  <div
                    className={cn(
                      "text-center space-y-6",
                      isRTL && "rtl:text-right",
                    )}
                  >
                    <motion.div
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${method.bgColor} group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: isRTL ? -5 : 5 }}
                    >
                      <method.icon
                        className={`w-10 h-10 ${method.textColor}`}
                      />
                    </motion.div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-whitetext group-hover:text-primary transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {method.description}
                      </p>
                      <div className={`font-semibold ${method.textColor}`}>
                        {/* {method.value} */}
                      </div>
                    </div>

                    <Button
                      className={`w-full bg-gradient-to-r ${method.color} hover:shadow-lg transition-all duration-300 group-hover:translate-y-1`}
                    >
                      <span className={cn(isRTL ? "ml-2" : "mr-2")}>
                        {loading
                          ? "Contact Now"
                          : t("contact.contactNow", "Contact Now")}
                      </span>
                      <SparklesIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </MagicCard>
              </motion.div>
            ))}

            {/* Third card (promise) as the 3rd grid item */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + CONTACT_METHODS.length * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <MagicCard className="p-8 h-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/50">
                <div className={cn("text-center", isRTL && "rtl:text-right")}>
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
                    whileHover={{ scale: 1.1, rotate: isRTL ? -5 : 5 }}
                  >
                    <CheckIcon className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h4 className="text-xl font-bold text-whitetext mb-2">
                    {loading
                      ? "24-Hour Response Guarantee"
                      : t(
                          "contact.guarantee.title",
                          "24-Hour Response Guarantee",
                        )}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {loading
                      ? "We promise to respond to your inquiry within 24 hours during business days."
                      : t(
                          "contact.guarantee.description",
                          "We promise to respond to your inquiry within 24 hours during business days.",
                        )}
                  </p>
                </div>
              </MagicCard>
            </motion.div>
          </div>
        </div>
      </AnimationContainer>

      <Footer />
    </div>
  );
}
