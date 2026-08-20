/**
 * Auth Controller for BharathShield
 * Provides User and Admin role authentication & user registration
 */

const registeredUsers = new Map([
  ['admin', { username: 'admin', displayName: 'System Admin', role: 'admin', password: 'admin123' }],
  ['user', { username: 'user', displayName: 'Standard User', role: 'user', password: 'user123' }]
]);

async function handleLogin(req, res) {
  try {
    const { username = '', password = '', role } = req.body || {};
    const cleanUsername = username.trim().toLowerCase();

    // Check registered memory first
    if (registeredUsers.has(cleanUsername)) {
      const existing = registeredUsers.get(cleanUsername);
      if (password && existing.password && password !== existing.password) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid password. Please check your credentials.' });
      }

      return res.status(200).json({
        success: true,
        user: {
          username: existing.username,
          displayName: existing.displayName,
          role: existing.role,
          token: `token-${existing.username}-session`
        }
      });
    }

    // Auto-detect role if new username
    const autoRole = role || (cleanUsername.startsWith('admin') ? 'admin' : 'user');
    const displayName = cleanUsername ? cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1) : 'Standard User';

    return res.status(200).json({
      success: true,
      user: {
        username: cleanUsername || 'user',
        displayName,
        role: autoRole,
        token: `token-${cleanUsername}-session`
      }
    });
  } catch (error) {
    console.error('[Auth API Error]:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Login failed.' });
  }
}

async function handleRegister(req, res) {
  try {
    const { username = '', password = '', displayName = '', role = 'user' } = req.body || {};
    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername || !password) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Username and password are required for registration.' });
    }

    if (registeredUsers.has(cleanUsername)) {
      return res.status(400).json({ error: 'ALREADY_EXISTS', message: 'Username already registered. Please choose another username or log in.' });
    }

    const autoRole = role || (cleanUsername.startsWith('admin') ? 'admin' : 'user');
    const finalDisplayName = displayName.trim() || cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);

    const newUser = {
      username: cleanUsername,
      displayName: finalDisplayName,
      role: autoRole,
      password
    };

    registeredUsers.set(cleanUsername, newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
        token: `token-${newUser.username}-session`
      }
    });
  } catch (error) {
    console.error('[Register API Error]:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Registration failed.' });
  }
}

module.exports = {
  handleLogin,
  handleRegister
};
