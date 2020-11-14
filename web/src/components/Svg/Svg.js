const Svg = ({ name, className: className2, strokeWidth = 2 }) => {
  const svgs = {
    'chevron-down': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    ),
    'dots-vertical': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
        />
      </svg>
    ),
    fork: (
      <svg
        viewBox="-3 -3 32 32" // TODO size this properly, or get a better icon
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
      >
        <path
          d="M7.5 21C7.5 20.1719 6.82812 19.5 6 19.5C5.17188 19.5 4.5 20.1719 4.5 21C4.5 21.8281 5.17188 22.5 6 22.5C6.82812 22.5 7.5 21.8281 7.5 21ZM7.5 3C7.5 2.17188 6.82812 1.5 6 1.5C5.17188 1.5 4.5 2.17188 4.5 3C4.5 3.82812 5.17188 4.5 6 4.5C6.82812 4.5 7.5 3.82812 7.5 3ZM20.5 5C20.5 4.17188 19.8281 3.5 19 3.5C18.1719 3.5 17.5 4.17188 17.5 5C17.5 5.82812 18.1719 6.5 19 6.5C19.8281 6.5 20.5 5.82812 20.5 5ZM22 5C22 6.10938 21.3906 7.07812 20.5 7.59375C20.4531 13.2344 13.4531 14.4844 10.7969 15.3281C8.3125 16.1094 7.5 16.4844 7.5 18V18.4062C8.39062 18.9219 9 19.8906 9 21C9 22.6562 7.65625 24 6 24C4.34375 24 3 22.6562 3 21C3 19.8906 3.60938 18.9219 4.5 18.4062V5.59375C3.60938 5.07812 3 4.10938 3 3C3 1.34375 4.34375 0 6 0C7.65625 0 9 1.34375 9 3C9 4.10938 8.39062 5.07812 7.5 5.59375V13.3594C8.29688 12.9688 9.14062 12.7031 9.90625 12.4688C12.8125 11.5469 17.4688 10.8594 17.5 7.59375C16.6094 7.07812 16 6.10938 16 5C16 3.34375 17.3438 2 19 2C20.6562 2 22 3.34375 22 5Z"
          fill="currentColor"
        />
      </svg>
    ),
    logout: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    ),
    pencil: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
    plus: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
    'plus-circle': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    save: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
        />
      </svg>
    ),
    terminal: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  }

  return <div className={className2 || 'h-10 w-10'}>{svgs[name]}</div>
}

export default Svg
