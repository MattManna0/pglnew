import Image from 'next/image';

export default function AdminHome() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f0fdf4, #ffffff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <Image
          src="/greenleaf.png"
          alt="Green Leaf Logo"
          width={80}
          height={80}
          style={{ margin: '0 auto 1rem' }}
          priority
        />
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Admin Home
        </h1>
        <h2 style={{
          fontSize: '0.875rem',
          color: '#4b5563'
        }}>
          Welcome to Project Green Leaf Admin Panel
        </h2>
      </div>
    </div>
  );
}
