import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="nav-header">
      <div className="nav-container">
        <NavLink to="/" className="nav-brand">
          <Calendar size={22} color="#06b6d4" />
          <span>EventHub</span> Admin
        </NavLink>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LayoutDashboard size={16} />
              Dashboard
            </div>
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={16} />
              Add Event
            </div>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}