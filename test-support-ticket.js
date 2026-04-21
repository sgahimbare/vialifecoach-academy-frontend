// Test script to verify support ticket submission and admin viewing
// Run this to test the full flow

async function testSupportTicket() {
  console.log("Testing support ticket submission...");
  
  // 1. Submit a test ticket
  try {
    const response = await fetch('http://localhost:5000/api/v1/support/ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        category: 'Technical Issue',
        subject: 'Test Support Ticket',
        message: 'This is a test support ticket to verify the system works.'
      })
    });
    
    const result = await response.json();
    console.log('✅ Ticket submitted:', result);
    
    // 2. Try to get admin token (you'll need to replace with actual admin credentials)
    console.log('\nTo view this ticket in admin:');
    console.log('1. Login as admin at: http://localhost:5173/admin/login');
    console.log('2. Go to: http://localhost:5173/admin/operations');
    console.log('3. Look for the ticket in the Support Tickets section');
    console.log('4. Click on any ticket row to view full details');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSupportTicket();
