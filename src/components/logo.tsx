import React, { CSSProperties, FC } from "react";

interface LogoProps {
  className?: string;
  style?: CSSProperties;
}

export const Logo: FC<LogoProps> = ({ className = 'w-20 mr-2', ...rest }): JSX.Element => {
  return (
    <>
      <svg
        className={className + " " + "inline-block dark:hidden"}
        viewBox="0 0 1189 245"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <path
          d="M59.04 18.432c0-4.416 3.648-8.544 10.944-12.384C77.28 2.016 86.88 0 98.784 0 108 0 113.952 1.92 116.64 5.76c1.92 2.688 2.88 5.184 2.88 7.488v8.64c21.696 2.304 36.768 6.336 45.216 12.096 3.456 2.304 5.184 4.512 5.184 6.624 0 9.984-2.4 20.736-7.2 32.256-4.608 11.52-9.12 17.28-13.536 17.28-.768 0-3.264-.864-7.488-2.592-12.672-5.568-23.232-8.352-31.68-8.352-8.256 0-13.92.768-16.992 2.304-2.88 1.536-4.32 3.936-4.32 7.2 0 3.072 2.112 5.472 6.336 7.2 4.224 1.728 9.408 3.264 15.552 4.608 6.336 1.152 13.152 3.168 20.448 6.048 7.488 2.88 14.4 6.336 20.736 10.368s11.616 10.08 15.84 18.144c4.224 7.872 6.336 15.936 6.336 24.192s-.768 15.072-2.304 20.448c-1.536 5.376-4.224 10.944-8.064 16.704-3.648 5.76-9.312 10.944-16.992 15.552-7.488 4.416-16.512 7.68-27.072 9.792v4.608c0 4.416-3.648 8.544-10.944 12.384-7.296 4.032-16.896 6.048-28.8 6.048-9.216 0-15.168-1.92-17.856-5.76-1.92-2.688-2.88-5.184-2.88-7.488v-8.64c-12.48-1.152-23.328-2.976-32.544-5.472C8.832 212.64 0 207.456 0 201.888 0 191.136 1.536 180 4.608 168.48c3.072-11.712 6.72-17.568 10.944-17.568.768 0 8.736 2.592 23.904 7.776 15.168 5.184 26.592 7.776 34.272 7.776s12.672-.768 14.976-2.304c2.304-1.728 3.456-4.128 3.456-7.2s-2.112-5.664-6.336-7.776c-4.224-2.304-9.504-4.128-15.84-5.472-6.336-1.344-13.248-3.456-20.736-6.336-7.296-2.88-14.112-6.24-20.448-10.08s-11.616-9.504-15.84-16.992c-4.224-7.488-6.336-16.224-6.336-26.208 0-35.328 17.472-55.968 52.416-61.92v-3.744z"
          fill="#0CD15B"
        />
        <path
          d="M273.912 55.64c0 7.68-.288 15.072-.864 22.176-.384 7.104-.768 12.096-1.152 14.976h2.304c4.992-8.064 11.424-13.92 19.296-17.568 7.872-3.648 16.608-5.472 26.208-5.472 17.088 0 30.72 4.608 40.896 13.824 10.368 9.024 15.552 23.616 15.552 43.776V229.88H333.24v-91.872c0-22.656-8.448-33.984-25.344-33.984-12.864 0-21.792 4.512-26.784 13.536-4.8 8.832-7.2 21.6-7.2 38.304v74.016H231V11h42.912v44.64zM484.793 69.464c21.12 0 37.248 4.608 48.384 13.824 11.328 9.024 16.992 22.944 16.992 41.76V229.88h-29.952l-8.352-21.312h-1.152c-6.72 8.448-13.824 14.592-21.312 18.432-7.488 3.84-17.76 5.76-30.816 5.76-14.016 0-25.632-4.032-34.848-12.096-9.216-8.256-13.824-20.832-13.824-37.728 0-16.704 5.856-28.992 17.568-36.864 11.712-8.064 29.28-12.48 52.704-13.248l27.36-.864v-6.912c0-8.256-2.208-14.304-6.624-18.144-4.224-3.84-10.176-5.76-17.856-5.76a74.163 74.163 0 00-22.464 3.456c-7.296 2.112-14.592 4.8-21.888 8.064l-14.112-29.088c8.448-4.416 17.76-7.872 27.936-10.368 10.368-2.496 21.12-3.744 32.256-3.744zm6.048 88.128c-13.824.384-23.424 2.88-28.8 7.488-5.376 4.608-8.064 10.656-8.064 18.144 0 6.528 1.92 11.232 5.76 14.112 3.84 2.688 8.832 4.032 14.976 4.032 9.216 0 16.992-2.688 23.328-8.064 6.336-5.568 9.504-13.344 9.504-23.328v-12.96l-16.704.576zM683.374 69.752c16.896 0 30.432 4.608 40.608 13.824 10.176 9.024 15.264 23.616 15.264 43.776V229.88h-42.912v-91.872c0-11.328-2.016-19.776-6.048-25.344-4.032-5.76-10.464-8.64-19.296-8.64-13.056 0-21.984 4.512-26.784 13.536-4.8 8.832-7.2 21.6-7.2 38.304v74.016h-42.912V72.632h32.832l5.76 20.16h2.304c4.992-8.064 11.808-13.92 20.448-17.568 8.832-3.648 18.144-5.472 27.936-5.472zM833.199 232.76c-17.472 0-31.776-6.816-42.912-20.448-10.944-13.824-16.416-34.08-16.416-60.768 0-26.88 5.568-47.232 16.704-61.056 11.136-13.824 25.728-20.736 43.776-20.736 11.328 0 20.64 2.208 27.936 6.624 7.296 4.416 13.056 9.888 17.28 16.416h1.44c-.576-3.072-1.248-7.488-2.016-13.248-.768-5.952-1.152-12-1.152-18.144V11h42.912v218.88h-32.832l-8.352-20.448h-1.728c-4.224 6.528-9.888 12.096-16.992 16.704-7.104 4.416-16.32 6.624-27.648 6.624zm14.976-34.272c11.904 0 20.256-3.456 25.056-10.368 4.8-7.104 7.296-17.664 7.488-31.68v-4.608c0-15.36-2.4-27.072-7.2-35.136-4.608-8.064-13.248-12.096-25.92-12.096-9.408 0-16.8 4.128-22.176 12.384-5.376 8.064-8.064 19.776-8.064 35.136 0 15.36 2.688 26.976 8.064 34.848 5.376 7.68 12.96 11.52 22.752 11.52zM1008.54 229.88h-42.915V11h42.915v218.88zM1118.17 69.752c21.7 0 38.88 6.24 51.56 18.72 12.67 12.288 19.01 29.856 19.01 52.704v20.736h-101.38c.38 12.096 3.94 21.6 10.66 28.512 6.91 6.912 16.41 10.368 28.51 10.368 10.17 0 19.39-.96 27.65-2.88 8.25-2.112 16.79-5.28 25.63-9.504v33.12c-7.68 3.84-15.84 6.624-24.48 8.352-8.45 1.92-18.72 2.88-30.82 2.88-15.74 0-29.66-2.88-41.76-8.64-12.09-5.952-21.6-14.88-28.51-26.784-6.91-11.904-10.37-26.88-10.37-44.928 0-18.432 3.07-33.696 9.22-45.792 6.33-12.288 15.07-21.504 26.21-27.648 11.13-6.144 24.09-9.216 38.87-9.216zm.29 30.528c-8.25 0-15.17 2.688-20.73 8.064-5.38 5.376-8.55 13.728-9.51 25.056h60.2c-.2-9.6-2.69-17.472-7.49-23.616-4.8-6.336-12.29-9.504-22.47-9.504z"
          fill="#fff"
        />
      </svg>
      <svg
        className={className + " " + "hidden dark:inline-block"}
        viewBox="0 0 1189 245"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M59.04 18.432c0-4.416 3.648-8.544 10.944-12.384C77.28 2.016 86.88 0 98.784 0 108 0 113.952 1.92 116.64 5.76c1.92 2.688 2.88 5.184 2.88 7.488v8.64c21.696 2.304 36.768 6.336 45.216 12.096 3.456 2.304 5.184 4.512 5.184 6.624 0 9.984-2.4 20.736-7.2 32.256-4.608 11.52-9.12 17.28-13.536 17.28-.768 0-3.264-.864-7.488-2.592-12.672-5.568-23.232-8.352-31.68-8.352-8.256 0-13.92.768-16.992 2.304-2.88 1.536-4.32 3.936-4.32 7.2 0 3.072 2.112 5.472 6.336 7.2 4.224 1.728 9.408 3.264 15.552 4.608 6.336 1.152 13.152 3.168 20.448 6.048 7.488 2.88 14.4 6.336 20.736 10.368s11.616 10.08 15.84 18.144c4.224 7.872 6.336 15.936 6.336 24.192s-.768 15.072-2.304 20.448c-1.536 5.376-4.224 10.944-8.064 16.704-3.648 5.76-9.312 10.944-16.992 15.552-7.488 4.416-16.512 7.68-27.072 9.792v4.608c0 4.416-3.648 8.544-10.944 12.384-7.296 4.032-16.896 6.048-28.8 6.048-9.216 0-15.168-1.92-17.856-5.76-1.92-2.688-2.88-5.184-2.88-7.488v-8.64c-12.48-1.152-23.328-2.976-32.544-5.472C8.832 212.64 0 207.456 0 201.888 0 191.136 1.536 180 4.608 168.48c3.072-11.712 6.72-17.568 10.944-17.568.768 0 8.736 2.592 23.904 7.776 15.168 5.184 26.592 7.776 34.272 7.776s12.672-.768 14.976-2.304c2.304-1.728 3.456-4.128 3.456-7.2s-2.112-5.664-6.336-7.776c-4.224-2.304-9.504-4.128-15.84-5.472-6.336-1.344-13.248-3.456-20.736-6.336-7.296-2.88-14.112-6.24-20.448-10.08s-11.616-9.504-15.84-16.992c-4.224-7.488-6.336-16.224-6.336-26.208 0-35.328 17.472-55.968 52.416-61.92v-3.744z"
          fill="#0CD15B"
        />
        <path
          d="M273.912 55.64c0 7.68-.288 15.072-.864 22.176-.384 7.104-.768 12.096-1.152 14.976h2.304c4.992-8.064 11.424-13.92 19.296-17.568 7.872-3.648 16.608-5.472 26.208-5.472 17.088 0 30.72 4.608 40.896 13.824 10.368 9.024 15.552 23.616 15.552 43.776V229.88H333.24v-91.872c0-22.656-8.448-33.984-25.344-33.984-12.864 0-21.792 4.512-26.784 13.536-4.8 8.832-7.2 21.6-7.2 38.304v74.016H231V11h42.912v44.64zM484.793 69.464c21.12 0 37.248 4.608 48.384 13.824 11.328 9.024 16.992 22.944 16.992 41.76V229.88h-29.952l-8.352-21.312h-1.152c-6.72 8.448-13.824 14.592-21.312 18.432-7.488 3.84-17.76 5.76-30.816 5.76-14.016 0-25.632-4.032-34.848-12.096-9.216-8.256-13.824-20.832-13.824-37.728 0-16.704 5.856-28.992 17.568-36.864 11.712-8.064 29.28-12.48 52.704-13.248l27.36-.864v-6.912c0-8.256-2.208-14.304-6.624-18.144-4.224-3.84-10.176-5.76-17.856-5.76a74.163 74.163 0 00-22.464 3.456c-7.296 2.112-14.592 4.8-21.888 8.064l-14.112-29.088c8.448-4.416 17.76-7.872 27.936-10.368 10.368-2.496 21.12-3.744 32.256-3.744zm6.048 88.128c-13.824.384-23.424 2.88-28.8 7.488-5.376 4.608-8.064 10.656-8.064 18.144 0 6.528 1.92 11.232 5.76 14.112 3.84 2.688 8.832 4.032 14.976 4.032 9.216 0 16.992-2.688 23.328-8.064 6.336-5.568 9.504-13.344 9.504-23.328v-12.96l-16.704.576zM683.374 69.752c16.896 0 30.432 4.608 40.608 13.824 10.176 9.024 15.264 23.616 15.264 43.776V229.88h-42.912v-91.872c0-11.328-2.016-19.776-6.048-25.344-4.032-5.76-10.464-8.64-19.296-8.64-13.056 0-21.984 4.512-26.784 13.536-4.8 8.832-7.2 21.6-7.2 38.304v74.016h-42.912V72.632h32.832l5.76 20.16h2.304c4.992-8.064 11.808-13.92 20.448-17.568 8.832-3.648 18.144-5.472 27.936-5.472zM833.199 232.76c-17.472 0-31.776-6.816-42.912-20.448-10.944-13.824-16.416-34.08-16.416-60.768 0-26.88 5.568-47.232 16.704-61.056 11.136-13.824 25.728-20.736 43.776-20.736 11.328 0 20.64 2.208 27.936 6.624 7.296 4.416 13.056 9.888 17.28 16.416h1.44c-.576-3.072-1.248-7.488-2.016-13.248-.768-5.952-1.152-12-1.152-18.144V11h42.912v218.88h-32.832l-8.352-20.448h-1.728c-4.224 6.528-9.888 12.096-16.992 16.704-7.104 4.416-16.32 6.624-27.648 6.624zm14.976-34.272c11.904 0 20.256-3.456 25.056-10.368 4.8-7.104 7.296-17.664 7.488-31.68v-4.608c0-15.36-2.4-27.072-7.2-35.136-4.608-8.064-13.248-12.096-25.92-12.096-9.408 0-16.8 4.128-22.176 12.384-5.376 8.064-8.064 19.776-8.064 35.136 0 15.36 2.688 26.976 8.064 34.848 5.376 7.68 12.96 11.52 22.752 11.52zM1008.54 229.88h-42.915V11h42.915v218.88zM1118.17 69.752c21.7 0 38.88 6.24 51.56 18.72 12.67 12.288 19.01 29.856 19.01 52.704v20.736h-101.38c.38 12.096 3.94 21.6 10.66 28.512 6.91 6.912 16.41 10.368 28.51 10.368 10.17 0 19.39-.96 27.65-2.88 8.25-2.112 16.79-5.28 25.63-9.504v33.12c-7.68 3.84-15.84 6.624-24.48 8.352-8.45 1.92-18.72 2.88-30.82 2.88-15.74 0-29.66-2.88-41.76-8.64-12.09-5.952-21.6-14.88-28.51-26.784-6.91-11.904-10.37-26.88-10.37-44.928 0-18.432 3.07-33.696 9.22-45.792 6.33-12.288 15.07-21.504 26.21-27.648 11.13-6.144 24.09-9.216 38.87-9.216zm.29 30.528c-8.25 0-15.17 2.688-20.73 8.064-5.38 5.376-8.55 13.728-9.51 25.056h60.2c-.2-9.6-2.69-17.472-7.49-23.616-4.8-6.336-12.29-9.504-22.47-9.504z"
          fill="#0D0F26"
        />
      </svg>
    </>
  );
};

export const LogoMark: FC<LogoProps & {fill: string}> = ({ className, fill = '#0CD15B', ...rest }): JSX.Element => {
  return (
    <>
      <svg
        className={className + " " + "inline-block dark:hidden"}
        viewBox="0 0 190 245"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <path
          d="M59.04 18.432c0-4.416 3.648-8.544 10.944-12.384C77.28 2.016 86.88 0 98.784 0 108 0 113.952 1.92 116.64 5.76c1.92 2.688 2.88 5.184 2.88 7.488v8.64c21.696 2.304 36.768 6.336 45.216 12.096 3.456 2.304 5.184 4.512 5.184 6.624 0 9.984-2.4 20.736-7.2 32.256-4.608 11.52-9.12 17.28-13.536 17.28-.768 0-3.264-.864-7.488-2.592-12.672-5.568-23.232-8.352-31.68-8.352-8.256 0-13.92.768-16.992 2.304-2.88 1.536-4.32 3.936-4.32 7.2 0 3.072 2.112 5.472 6.336 7.2 4.224 1.728 9.408 3.264 15.552 4.608 6.336 1.152 13.152 3.168 20.448 6.048 7.488 2.88 14.4 6.336 20.736 10.368s11.616 10.08 15.84 18.144c4.224 7.872 6.336 15.936 6.336 24.192s-.768 15.072-2.304 20.448c-1.536 5.376-4.224 10.944-8.064 16.704-3.648 5.76-9.312 10.944-16.992 15.552-7.488 4.416-16.512 7.68-27.072 9.792v4.608c0 4.416-3.648 8.544-10.944 12.384-7.296 4.032-16.896 6.048-28.8 6.048-9.216 0-15.168-1.92-17.856-5.76-1.92-2.688-2.88-5.184-2.88-7.488v-8.64c-12.48-1.152-23.328-2.976-32.544-5.472C8.832 212.64 0 207.456 0 201.888 0 191.136 1.536 180 4.608 168.48c3.072-11.712 6.72-17.568 10.944-17.568.768 0 8.736 2.592 23.904 7.776 15.168 5.184 26.592 7.776 34.272 7.776s12.672-.768 14.976-2.304c2.304-1.728 3.456-4.128 3.456-7.2s-2.112-5.664-6.336-7.776c-4.224-2.304-9.504-4.128-15.84-5.472-6.336-1.344-13.248-3.456-20.736-6.336-7.296-2.88-14.112-6.24-20.448-10.08s-11.616-9.504-15.84-16.992c-4.224-7.488-6.336-16.224-6.336-26.208 0-35.328 17.472-55.968 52.416-61.92v-3.744z"
          fill={fill}
        />
      </svg>
      <svg
        className={className + " " + "hidden dark:inline-block"}
        viewBox="0 0 190 245"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M59.04 18.432c0-4.416 3.648-8.544 10.944-12.384C77.28 2.016 86.88 0 98.784 0 108 0 113.952 1.92 116.64 5.76c1.92 2.688 2.88 5.184 2.88 7.488v8.64c21.696 2.304 36.768 6.336 45.216 12.096 3.456 2.304 5.184 4.512 5.184 6.624 0 9.984-2.4 20.736-7.2 32.256-4.608 11.52-9.12 17.28-13.536 17.28-.768 0-3.264-.864-7.488-2.592-12.672-5.568-23.232-8.352-31.68-8.352-8.256 0-13.92.768-16.992 2.304-2.88 1.536-4.32 3.936-4.32 7.2 0 3.072 2.112 5.472 6.336 7.2 4.224 1.728 9.408 3.264 15.552 4.608 6.336 1.152 13.152 3.168 20.448 6.048 7.488 2.88 14.4 6.336 20.736 10.368s11.616 10.08 15.84 18.144c4.224 7.872 6.336 15.936 6.336 24.192s-.768 15.072-2.304 20.448c-1.536 5.376-4.224 10.944-8.064 16.704-3.648 5.76-9.312 10.944-16.992 15.552-7.488 4.416-16.512 7.68-27.072 9.792v4.608c0 4.416-3.648 8.544-10.944 12.384-7.296 4.032-16.896 6.048-28.8 6.048-9.216 0-15.168-1.92-17.856-5.76-1.92-2.688-2.88-5.184-2.88-7.488v-8.64c-12.48-1.152-23.328-2.976-32.544-5.472C8.832 212.64 0 207.456 0 201.888 0 191.136 1.536 180 4.608 168.48c3.072-11.712 6.72-17.568 10.944-17.568.768 0 8.736 2.592 23.904 7.776 15.168 5.184 26.592 7.776 34.272 7.776s12.672-.768 14.976-2.304c2.304-1.728 3.456-4.128 3.456-7.2s-2.112-5.664-6.336-7.776c-4.224-2.304-9.504-4.128-15.84-5.472-6.336-1.344-13.248-3.456-20.736-6.336-7.296-2.88-14.112-6.24-20.448-10.08s-11.616-9.504-15.84-16.992c-4.224-7.488-6.336-16.224-6.336-26.208 0-35.328 17.472-55.968 52.416-61.92v-3.744z"
          fill={fill}
        />
      </svg>
    </>
  );
};

export default Logo;