import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommandPalette from '../components/landing/CommandPalette';
import LandingNavbar from '../components/landing/LandingNavbar';
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

describe('Command Center / Ctrl+K Experience Phase 6 Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not render dialog when isOpen is false', () => {
    render(
      <BrowserRouter>
        <CommandPalette isOpen={false} onClose={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal with dialog semantics, header, input placeholder, and footer when isOpen is true', () => {
    render(
      <BrowserRouter>
        <CommandPalette isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>
    );

    // Dialog accessibility
    const dialog = screen.getByRole('dialog', { name: /Command Center/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Input placeholder
    const input = screen.getByPlaceholderText('Search commands, sections, or actions...');
    expect(input).toBeInTheDocument();

    // Footer
    expect(screen.getByText('↑↓ Navigate')).toBeInTheDocument();
    expect(screen.getByText('↵ Select')).toBeInTheDocument();
    expect(screen.getByText('ESC Close')).toBeInTheDocument();
    expect(screen.getByText('SIMULATED PRODUCT NAVIGATION')).toBeInTheDocument();
  });

  it('renders all required command groups and commands', () => {
    render(
      <BrowserRouter>
        <CommandPalette isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>
    );

    // Groups
    expect(screen.getByText('NAVIGATE')).toBeInTheDocument();
    expect(screen.getByText('PRODUCT PREVIEW')).toBeInTheDocument();
    expect(screen.getByText('QUICK ACTIONS')).toBeInTheDocument();

    // NAVIGATE commands
    expect(screen.getByText('Go to Hero')).toBeInTheDocument();
    expect(screen.getByText('Go to Capabilities')).toBeInTheDocument();
    expect(screen.getByText('Go to Product Experience')).toBeInTheDocument();
    expect(screen.getByText('Go to Workflow')).toBeInTheDocument();
    expect(screen.getByText('Go to Security')).toBeInTheDocument();

    // PRODUCT PREVIEW commands
    expect(screen.getByText('Preview Employee Console')).toBeInTheDocument();
    expect(screen.getByText('Preview Manager Console')).toBeInTheDocument();
    expect(screen.getByText('Preview Admin / HR Console')).toBeInTheDocument();

    // QUICK ACTIONS commands
    expect(screen.getByText('Explore ELMS')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Run Product Demo')).toBeInTheDocument();
  });

  it('filters commands correctly when typing in search input', () => {
    render(
      <BrowserRouter>
        <CommandPalette isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Search commands, sections, or actions...');

    // Search: "manager"
    fireEvent.change(input, { target: { value: 'manager' } });
    expect(screen.getByText('Preview Manager Console')).toBeInTheDocument();
    expect(screen.queryByText('Go to Hero')).not.toBeInTheDocument();

    // Search: "security"
    fireEvent.change(input, { target: { value: 'security' } });
    expect(screen.getByText('Go to Security')).toBeInTheDocument();
    expect(screen.queryByText('Preview Manager Console')).not.toBeInTheDocument();

    // Search: "login"
    fireEvent.change(input, { target: { value: 'login' } });
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByText('Go to Security')).not.toBeInTheDocument();

    // Search: "workflow"
    fireEvent.change(input, { target: { value: 'workflow' } });
    expect(screen.getByText('Go to Workflow')).toBeInTheDocument();
    expect(screen.getByText('Run Product Demo')).toBeInTheDocument();

    // Search: unmatched query
    fireEvent.change(input, { target: { value: 'xyzunknown999' } });
    expect(screen.getByText('No matching commands')).toBeInTheDocument();
  });

  it('supports keyboard navigation (ArrowDown, ArrowUp, Enter) to select and execute commands', () => {
    const handleClose = vi.fn();
    render(
      <BrowserRouter>
        <CommandPalette isOpen={true} onClose={handleClose} />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Search commands, sections, or actions...');

    // Initially first command (Go to Hero) is selected
    const heroBtn = screen.getByRole('button', { name: 'Go to Hero' });
    expect(heroBtn).toHaveAttribute('aria-pressed', 'true');

    // ArrowDown -> Go to Capabilities
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const capBtn = screen.getByRole('button', { name: 'Go to Capabilities' });
    expect(capBtn).toHaveAttribute('aria-pressed', 'true');
    expect(heroBtn).toHaveAttribute('aria-pressed', 'false');

    // ArrowUp -> back to Go to Hero
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(heroBtn).toHaveAttribute('aria-pressed', 'true');

    // Mock document.querySelector for scroll action
    const mockScrollIntoView = vi.fn();
    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = mockScrollIntoView;
    vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);

    // Enter -> executes Go to Hero
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleClose).toHaveBeenCalled();
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('closes on Escape key press, close button click, and backdrop click', () => {
    const handleClose = vi.fn();
    const { unmount } = render(
      <BrowserRouter>
        <CommandPalette isOpen={true} onClose={handleClose} />
      </BrowserRouter>
    );

    // Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Close button
    const closeBtn = screen.getByRole('button', { name: 'Close Command Center' });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('executes Sign In command by navigating to /login', () => {
    const handleClose = vi.fn();
    render(
      <BrowserRouter>
        <CommandPalette isOpen={true} onClose={handleClose} />
      </BrowserRouter>
    );

    const signinBtn = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(signinBtn);

    expect(handleClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('executes Product Preview command and dispatches elms:switch-role event', () => {
    const handleClose = vi.fn();
    const roleListener = vi.fn();
    window.addEventListener('elms:switch-role', roleListener);

    render(
      <BrowserRouter>
        <CommandPalette isOpen={true} onClose={handleClose} />
      </BrowserRouter>
    );

    const managerPreviewBtn = screen.getByRole('button', { name: 'Preview Manager Console' });
    fireEvent.click(managerPreviewBtn);

    expect(handleClose).toHaveBeenCalled();
    expect(roleListener).toHaveBeenCalled();
    const eventDetail = roleListener.mock.calls[0][0].detail;
    expect(eventDetail).toEqual({ roleId: 'manager' });

    window.removeEventListener('elms:switch-role', roleListener);
  });

  it('executes Run Product Demo command and dispatches elms:run-workflow-demo event', () => {
    const handleClose = vi.fn();
    const demoListener = vi.fn();
    window.addEventListener('elms:run-workflow-demo', demoListener);

    render(
      <BrowserRouter>
        <CommandPalette isOpen={true} onClose={handleClose} />
      </BrowserRouter>
    );

    const demoBtn = screen.getByRole('button', { name: 'Run Product Demo' });
    fireEvent.click(demoBtn);

    expect(handleClose).toHaveBeenCalled();
    expect(demoListener).toHaveBeenCalled();

    window.removeEventListener('elms:run-workflow-demo', demoListener);
  });

  it('renders visible desktop Command Center trigger and mobile Quick Actions trigger in LandingNavbar', () => {
    const handleOpen = vi.fn();
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, user: null }}>
        <BrowserRouter>
          <LandingNavbar onOpenCommandPalette={handleOpen} />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    // Desktop trigger
    const desktopTrigger = screen.getByRole('button', { name: 'Open Command Center' });
    expect(desktopTrigger).toBeInTheDocument();
    expect(screen.getByText('Command Center')).toBeInTheDocument();
    expect(screen.getByText('CTRL K')).toBeInTheDocument();

    // Mobile trigger
    const mobileTrigger = screen.getByRole('button', { name: 'Quick Actions' });
    expect(mobileTrigger).toBeInTheDocument();

    // Click desktop trigger
    fireEvent.click(desktopTrigger);
    expect(handleOpen).toHaveBeenCalledTimes(1);

    // Click mobile trigger
    fireEvent.click(mobileTrigger);
    expect(handleOpen).toHaveBeenCalledTimes(2);
  });
});
