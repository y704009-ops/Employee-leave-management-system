import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';
import { AuthContext } from '../context/AuthContext';

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CTASection & LandingFooter Phase 7 Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CTASection eyebrow, headline, supporting text, and trust microcopy correctly', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, user: null }}>
        <BrowserRouter>
          <CTASection />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    // Eyebrow
    expect(screen.getByText('READY TO WORK SMARTER?')).toBeInTheDocument();

    // Headline
    expect(
      screen.getByRole('heading', {
        name: /Bring your workforce operations into one connected system\./i,
      })
    ).toBeInTheDocument();

    // Supporting text
    expect(
      screen.getByText(
        /Give employees a simpler way to manage leave, give managers clearer visibility, and give HR a reliable operational record\./i
      )
    ).toBeInTheDocument();

    // Connected operations ribbon
    expect(screen.getByText('CONNECTED WORKFORCE OPERATIONS')).toBeInTheDocument();
    expect(screen.getByText('SYSTEM ACTIVE')).toBeInTheDocument();

    // Trust microcopy
    expect(
      screen.getByText(
        /Role-based access • Centralized leave records • Auditable workflows/i
      )
    ).toBeInTheDocument();

    // CTAs
    expect(screen.getByRole('button', { name: /Sign In to ELMS/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Product/i })).toBeInTheDocument();
  });

  it('navigates to /login when clicking Sign In to ELMS as unauthenticated user', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, user: null }}>
        <BrowserRouter>
          <CTASection />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    const signinBtn = screen.getByRole('button', { name: /Sign In to ELMS/i });
    fireEvent.click(signinBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('smoothly scrolls to product experience when clicking Explore Product', () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = mockScrollIntoView;
    vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);

    render(
      <AuthContext.Provider value={{ isAuthenticated: false, user: null }}>
        <BrowserRouter>
          <CTASection />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    const exploreBtn = screen.getByRole('link', { name: /Explore Product/i });
    fireEvent.click(exploreBtn);

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('renders LandingFooter with branding, navigation links, and operational status', () => {
    render(
      <BrowserRouter>
        <LandingFooter />
      </BrowserRouter>
    );

    // Branding
    expect(screen.getByText('WORKORA')).toBeInTheDocument();
    expect(screen.getByText('Workforce Management System')).toBeInTheDocument();

    // Navigation links
    expect(screen.getByRole('link', { name: 'Product' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Capabilities' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Role Consoles' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Workflow' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Security' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();

    // Operational status
    expect(screen.getByText('Product Preview')).toBeInTheDocument();

    // Copyright
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} WORKORA`))).toBeInTheDocument();
    expect(screen.getByText('Workforce Management System • Product Preview')).toBeInTheDocument();
  });
});
