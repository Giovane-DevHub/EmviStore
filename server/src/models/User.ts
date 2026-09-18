import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  name: string;
  passwordHash: string;
  role: 'admin' | 'employee';
  isProtected: boolean; // Se true, não pode ser deletado pelo sistema
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, default: 'Administrador Master' },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee'], default: 'admin' },
    isProtected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);

// Função para garantir a criação do usuário inicial '1' com senha '1'
export async function seedInitialAdmin() {
  const existingMaster = await User.findOne({ isProtected: true });
  if (!existingMaster) {
    const defaultUsername = '1';
    const defaultPassword = '1';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    await User.create({
      username: defaultUsername,
      name: 'Administrador Principal',
      passwordHash,
      role: 'admin',
      isProtected: true,
    });
    console.log('[Seed] Administrador Master criado: login "1" / senha "1"');
  }
}
