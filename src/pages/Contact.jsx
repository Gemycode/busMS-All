"use client"

import { useState } from "react"

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    privacy: false,
  })

  const [activeAccordion, setActiveAccordion] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSubmitStatus("success")
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
        privacy: false,
      })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  const faqItems = [
    {
      question: "How long does implementation typically take?",
      answer:
        "Implementation typically takes 2-4 weeks depending on the size of your fleet and specific requirements. Our team will work closely with you to ensure a smooth transition and provide comprehensive training for your staff.",
    },
    {
      question: "What hardware is required for GPS tracking?",
      answer:
        "BusTrack works with most standard GPS tracking devices. We can provide recommendations based on your specific needs or work with your existing hardware if compatible. Our system supports various GPS trackers, including both hardwired and plug-and-play options.",
    },
    {
      question: "Is BusTrack suitable for small fleets?",
      answer:
        "BusTrack offers scalable solutions for fleets of all sizes, from small operations with just a few vehicles to large transit authorities with hundreds of buses. Our pricing is structured to be accessible for smaller fleets while providing all the essential features needed for efficient management.",
    },
    {
      question: "Do you offer training for our staff?",
      answer:
        "Yes, we provide comprehensive training for all user roles including administrators, dispatchers, and drivers. Both in-person and virtual training options are available, and we also offer ongoing support and refresher training as needed.",
    },
    {
      question: "Can BusTrack integrate with our existing systems?",
      answer:
        "Yes, BusTrack is designed with integration capabilities in mind. We can integrate with various systems including payment processors, student information systems, HR software, maintenance management systems, and more. Our Enterprise plan includes custom API access for advanced integration needs.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We offer 24/7 technical support for all our customers. This includes phone support, email assistance, live chat, and remote troubleshooting. Our support team consists of experienced technicians who understand both the software and transportation industry requirements.",
    },
    {
      question: "Is my data secure with BusTrack?",
      answer:
        "Absolutely. We use enterprise-grade security measures including SSL encryption, secure data centers, regular security audits, and compliance with industry standards. All student and operational data is protected with multiple layers of security and backup systems.",
    },
    {
      question: "Can parents track buses in real-time?",
      answer:
        "Yes, our parent portal and mobile app provide real-time bus tracking, arrival notifications, and route updates. Parents can see exactly where their child's bus is and receive alerts about delays or route changes.",
    },
  ]

  const supportOptions = [
    {
      title: "Sales Inquiries",
      description: "Get pricing information and schedule a demo",
      icon: "fas fa-handshake",
      contact: "sales@bustrack.com",
      phone: "+1 (555) 123-4567",
    },
    {
      title: "Technical Support",
      description: "24/7 support for existing customers",
      icon: "fas fa-tools",
      contact: "support@bustrack.com",
      phone: "+1 (555) 987-6543",
    },
    {
      title: "Training & Onboarding",
      description: "Implementation and training assistance",
      icon: "fas fa-graduation-cap",
      contact: "training@bustrack.com",
      phone: "+1 (555) 456-7890",
    },
    {
      title: "Partnership Opportunities",
      description: "Become a BusTrack partner or reseller",
      icon: "fas fa-users",
      contact: "partners@bustrack.com",
      phone: "+1 (555) 321-0987",
    },
  ]

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Page Header */}
      <section className="hero pt-32 pb-16 bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-200">
              Have questions about BusTrack? Our team is here to help you find the right solution for your
              transportation needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark-blue mb-8">Get in Touch</h2>

              <div className="space-y-8 mb-12">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-brand-light-blue bg-opacity-20 rounded-full flex items-center justify-center">
                      <i className="fas fa-map-marker-alt text-brand-medium-blue text-xl"></i>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-brand-dark-blue mb-2">Our Location</h3>
                    <p className="text-gray-600">
                      123 Transit Avenue, Suite 400
                      <br />
                      San Francisco, CA 94107
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-brand-light-blue bg-opacity-20 rounded-full flex items-center justify-center">
                      <i className="fas fa-phone-alt text-brand-medium-blue text-xl"></i>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-brand-dark-blue mb-2">Phone</h3>
                    <p className="text-gray-600">
                      Sales: +1 (555) 123-4567
                      <br />
                      Support: +1 (555) 987-6543
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-brand-light-blue bg-opacity-20 rounded-full flex items-center justify-center">
                      <i className="fas fa-envelope text-brand-medium-blue text-xl"></i>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-brand-dark-blue mb-2">Email</h3>
                    <p className="text-gray-600">
                      General Inquiries: info@bustrack.com
                      <br />
                      Support: support@bustrack.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-brand-light-blue bg-opacity-20 rounded-full flex items-center justify-center">
                      <i className="fas fa-clock text-brand-medium-blue text-xl"></i>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-brand-dark-blue mb-2">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM (PST)
                      <br />
                      Saturday - Sunday: Closed
                      <br />
                      <span className="text-brand-medium-blue font-medium">24/7 Emergency Support Available</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-brand-dark-blue mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-brand-light-blue bg-opacity-20 rounded-full flex items-center justify-center text-brand-medium-blue hover:bg-brand-medium-blue hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-brand-light-blue bg-opacity-20 rounded-full flex items-center justify-center text-brand-medium-blue hover:bg-brand-medium-blue hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-brand-light-blue bg-opacity-20 rounded-full flex items-center justify-center text-brand-medium-blue hover:bg-brand-medium-blue hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-brand-light-blue bg-opacity-20 rounded-full flex items-center justify-center text-brand-medium-blue hover:bg-brand-medium-blue hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-brand-beige-1 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-brand-dark-blue mb-6">Send Us a Message</h2>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                  <i className="fas fa-check-circle mr-2"></i>
                  Thank you for your message! We'll get back to you within 24 hours.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  There was an error sending your message. Please try again or contact us directly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue transition-colors duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="demo">Request a Demo</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="training">Training & Implementation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue transition-colors duration-200"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    checked={formData.privacy}
                    onChange={handleInputChange}
                    required
                    className="mt-1 mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-brand-medium-blue hover:underline">
                      Privacy Policy
                    </a>{" "}
                    and consent to being contacted by BusTrack regarding my inquiry. *
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-medium-blue text-white py-3 px-6 rounded-md hover:bg-brand-dark-blue transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark-blue mb-4">How Can We Help?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the best way to reach us based on your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-light-blue bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${option.icon} text-brand-medium-blue text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark-blue mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-2">
                    <a href={`mailto:${option.contact}`} className="block text-brand-medium-blue hover:underline">
                      <i className="fas fa-envelope mr-2"></i>
                      {option.contact}
                    </a>
                    <a href={`tel:${option.phone}`} className="block text-brand-medium-blue hover:underline">
                      <i className="fas fa-phone mr-2"></i>
                      {option.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark-blue mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Find answers to common questions about BusTrack</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-6 bg-brand-beige-1 rounded-lg hover:bg-brand-beige-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-brand-dark-blue pr-4">{item.question}</h3>
                    <i
                      className={`fas fa-chevron-${activeAccordion === index ? "up" : "down"} text-brand-medium-blue transition-transform duration-200`}
                    ></i>
                  </div>
                </button>
                {activeAccordion === index && (
                  <div className="px-6 pb-6 bg-brand-beige-1 rounded-b-lg">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-brand-dark-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
            <p className="text-xl text-gray-200 mb-6">
              Our emergency support team is available 24/7 for critical issues
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <a
                href="tel:+15559876543"
                className="flex items-center text-lg hover:text-brand-light-blue transition-colors duration-200"
              >
                <i className="fas fa-phone-alt mr-3 text-xl"></i>
                Emergency Support: +1 (555) 987-6543
              </a>
              <a
                href="mailto:emergency@bustrack.com"
                className="flex items-center text-lg hover:text-brand-light-blue transition-colors duration-200"
              >
                <i className="fas fa-envelope mr-3 text-xl"></i>
                emergency@bustrack.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
