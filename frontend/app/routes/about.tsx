import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - Lazada Lite" },
    {
      name: "description",
      content: "Learn about Lazada Lite e-commerce platform",
    },
  ];
}

export default function About() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-gray-900 mb-8'>
          About Lazada Lite
        </h1>

        <div className='prose prose-lg max-w-none'>
          <p className='text-xl text-gray-600 mb-8'>
            Lazada Lite is a simplified e-commerce platform designed for
            educational purposes, inspired by the popular Lazada marketplace.
            Built as a Full Stack Development project for 2025B, it demonstrates
            modern web development practices using React, TypeScript, and
            contemporary frameworks.
          </p>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Our Mission
            </h2>
            <p className='text-gray-600 mb-4'>
              To provide a comprehensive learning experience in full-stack
              e-commerce development, showcasing real-world application
              architecture, user authentication, role-based access control, and
              modern UI/UX principles.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Platform Features
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Multi-Role System
                </h3>
                <p className='text-gray-700 text-sm'>
                  Support for customers, vendors, and shippers with distinct
                  functionalities and user experiences.
                </p>
              </div>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Modern Tech Stack
                </h3>
                <p className='text-gray-700 text-sm'>
                  Built with React Router v7, TypeScript, Tailwind CSS v4, and
                  shadcn/ui for a modern development experience.
                </p>
              </div>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Responsive Design
                </h3>
                <p className='text-gray-700 text-sm'>
                  Fully responsive design that works seamlessly across desktop,
                  tablet, and mobile devices.
                </p>
              </div>
            </div>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Technical Stack
            </h2>
            <div className='bg-gray-50 p-6 rounded-lg'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                <div>
                  <strong>Frontend:</strong>
                  <ul className='mt-2 space-y-1'>
                    <li>• React 19</li>
                    <li>• TypeScript</li>
                    <li>• React Router v7</li>
                    <li>• Tailwind CSS v4</li>
                  </ul>
                </div>
                <div>
                  <strong>UI Components:</strong>
                  <ul className='mt-2 space-y-1'>
                    <li>• shadcn/ui</li>
                    <li>• Radix UI</li>
                    <li>• Lucide Icons</li>
                    <li>• CSS Variables</li>
                  </ul>
                </div>
                <div>
                              <strong>State Management:</strong>
            <ul className='mt-2 space-y-1'>
              <li>• Redux Toolkit</li>
              <li>• React Hook Form</li>
              <li>• Zod Validation</li>
              <li>• Redux Persist</li>
            </ul>
                </div>
                <div>
                  <strong>Development:</strong>
                  <ul className='mt-2 space-y-1'>
                    <li>• Vite</li>
                    <li>• ESLint</li>
                    <li>• TypeScript</li>
                    <li>• Hot Reload</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Educational Purpose
            </h2>
            <p className='text-gray-600 mb-4'>
              This project serves as a comprehensive example of modern web
              development practices, including:
            </p>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li>Component-based architecture with React</li>
              <li>Type-safe development with TypeScript</li>
              <li>Modern routing with React Router v7</li>
              <li>Form handling and validation</li>
              <li>State management patterns</li>
              <li>Responsive design principles</li>
              <li>User authentication and authorization</li>
              <li>Role-based access control</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Contact & Support
            </h2>
            <p className='text-gray-600'>
              This is a student project created for educational purposes. For
              questions or assistance, please contact your instructor or refer
              to the project documentation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
