export default function ScreenShell({ children, className = '' }) {
  return <main className={`screen-shell ${className}`}>{children}</main>;
}
