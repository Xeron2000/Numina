'use client';

import React, { FormEvent } from 'react';
import { useTheme, ThemeContext, ThemeContextType } from '@/components/ThemeContext';
import { toast } from 'react-hot-toast';

interface SettingsFormProps {
  initialSettings?: {
    theme: string;
    language: string;
    notificationsEnabled: boolean;
  };
}

interface SettingsFormState {
  language: string;
  notificationsEnabled: boolean;
  isSubmitting: boolean;
}

class SettingsForm extends React.Component<SettingsFormProps, SettingsFormState> {
  static contextType = ThemeContext;
  context!: ThemeContextType;

  constructor(props: SettingsFormProps) {
    super(props);
    this.state = {
      language: props.initialSettings?.language || 'zh',
      notificationsEnabled: props.initialSettings?.notificationsEnabled || true,
      isSubmitting: false,
    };
  }

  handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    this.setState({ isSubmitting: true });

    try {
      const response = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: this.context.theme, // Access theme from context
          language: this.state.language,
          notificationsEnabled: this.state.notificationsEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error('保存设置失败');
      }

      toast.success('设置已保存');
    } catch (error) {
      toast.error('保存设置时出错');
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    const { setTheme } = this.context;
    return (
      <div className="google-card">
        <div className="card-body">
          <div className="tabs">
            <a className="tab tab-bordered tab-active">常规设置</a>
            <a className="tab tab-bordered">数据源管理</a>
          </div>

          <form onSubmit={this.handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">主题</span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={this.context.theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                required
              >
                <option value="light">浅色</option>
                <option value="dark">深色</option>
                <option value="system">系统默认</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">语言</span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={this.state.language}
                onChange={(e) => this.setState({ language: e.target.value })}
                required
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">通知</span>
              </label>
              <label className="label cursor-pointer">
                <span className="label-text">启用通知</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={this.state.notificationsEnabled}
                  onChange={(e) => this.setState({ notificationsEnabled: e.target.checked })}
                />
              </label>
            </div>

        <div className="flex justify-end">
          <button className="btn-google btn-primary" type="submit" disabled={this.state.isSubmitting}>
            {this.state.isSubmitting ? '保存中...' : '保存设置'}
          </button>
        </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SettingsForm;