import React, { useState, useEffect } from 'react';
import { X, UserPlus, Sparkles, Phone, Mail, Briefcase, Building } from 'lucide-react';
import { Member } from '../types';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMember: (memberData: Omit<Member, 'id' | 'joinedDate'> & { id?: string }) => void;
  initialMember?: Member | null;
}

const COLOR_PRESETS = [
  { label: 'Hồng Đào', value: 'from-pink-500 to-rose-600' },
  { label: 'Hồng Fuchsia', value: 'from-pink-600 to-fuchsia-600' },
  { label: 'Hoa Hồng Đỏ', value: 'from-rose-500 to-pink-600' },
  { label: 'Hồng Tím', value: 'from-pink-500 to-purple-500' },
  { label: 'Cam Hồng', value: 'from-rose-400 to-amber-500' },
];

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSaveMember,
  initialMember,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0].value);

  useEffect(() => {
    if (initialMember) {
      setName(initialMember.name);
      setEmail(initialMember.email);
      setRole(initialMember.role);
      setDepartment(initialMember.department || '');
      setPhone(initialMember.phone || '');
      setColor(initialMember.color || COLOR_PRESETS[0].value);
    } else {
      setName('');
      setEmail('');
      setRole('');
      setDepartment('Phòng Kỹ thuật & Thiết kế');
      setPhone('');
      setColor(COLOR_PRESETS[0].value);
    }
  }, [initialMember, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // Generate avatar initials from name
    const words = name.trim().split(' ');
    const avatar = words.length > 1
      ? `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase()
      : name.charAt(0).toUpperCase();

    onSaveMember({
      id: initialMember?.id,
      name: name.trim(),
      email: email.trim(),
      role: role.trim() || 'Thành viên',
      department: department.trim() || 'Đội ngũ',
      phone: phone.trim(),
      avatar,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-pink-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 bg-linear-to-r from-pink-50 via-white to-rose-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500 text-white shadow-xs">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialMember ? 'Chỉnh sửa thông tin thành viên' : 'Thêm thành viên mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Quản lý hồ sơ nhân sự và phân bổ công việc
              </p>
            </div>
          </div>

          <button
            id="close-member-modal-btn"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-pink-100 hover:text-pink-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Họ và tên: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Văn An"
              className="w-full rounded-xl border border-pink-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email công việc: <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="an.nguyen@company.vn"
                className="w-full rounded-xl border border-pink-200 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Role & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chức vụ / Vị trí:
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Frontend Developer..."
                  className="w-full rounded-xl border border-pink-200 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phòng ban:
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Kỹ thuật, Thiết kế..."
                  className="w-full rounded-xl border border-pink-200 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Số điện thoại:
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901 234 567"
                className="w-full rounded-xl border border-pink-200 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Avatar Color Theme */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Màu đại diện:
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.value}
                  onClick={() => setColor(preset.value)}
                  className={`h-8 w-8 rounded-xl bg-linear-to-tr ${preset.value} transition cursor-pointer shadow-xs ${
                    color === preset.value ? 'ring-2 ring-pink-500 ring-offset-2 scale-105' : 'hover:opacity-80'
                  }`}
                  title={preset.label}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !email.trim()}
              className="rounded-xl bg-linear-to-r from-pink-500 to-rose-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-pink-500/20 hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 transition cursor-pointer"
            >
              {initialMember ? 'Cập nhật' : 'Thêm thành viên'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
