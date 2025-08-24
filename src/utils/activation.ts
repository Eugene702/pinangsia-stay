import crypto from 'crypto';
import { prisma } from './database';
import { getDate } from './moment';

export const generateActivationToken = async (userId: string): Promise<string> => {
  // Generate a secure random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Set expiration to 24 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Save token to database
  await prisma.activationToken.create({
    data: {
      token,
      userId,
      expiresAt,
      createdAt: getDate()
    }
  });
  
  return token;
};

export const validateActivationToken = async (token: string) => {
  const activationToken = await prisma.activationToken.findUnique({
    where: { token },
    include: { user: true }
  });
  
  if (!activationToken) {
    return { valid: false, error: 'Token tidak valid' };
  }
  
  if (new Date() > activationToken.expiresAt) {
    // Delete expired token
    await prisma.activationToken.delete({
      where: { id: activationToken.id }
    });
    return { valid: false, error: 'Token sudah kadaluarsa' };
  }
  
  if (activationToken.user.status) {
    return { valid: false, error: 'Akun sudah aktif' };
  }
  
  return { valid: true, user: activationToken.user, tokenId: activationToken.id };
};

export const activateUser = async (userId: string, tokenId: string) => {
  // Activate user
  await prisma.user.update({
    where: { id: userId },
    data: { status: true }
  });
  
  // Delete used token
  await prisma.activationToken.delete({
    where: { id: tokenId }
  });
  
  // Delete all other tokens for this user
  await prisma.activationToken.deleteMany({
    where: { userId }
  });
};
