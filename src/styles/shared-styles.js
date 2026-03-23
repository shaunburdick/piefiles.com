/**
 * Shared CSS styles for Lit components
 * These can be imported and reused across components to avoid duplication
 *
 * @module shared-styles
 */

import { css } from 'lit';

/**
 * Card-style container with border and background
 */
export const cardStyles = css`
  .card {
    background-color: var(--color-content-bg, #f5f0e8);
    border: 2px solid var(--color-border, #000000);
    padding: 24px;
    margin-bottom: 24px;
  }

  .card h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    color: var(--color-primary-text, #543f20);
  }

  .card h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
    color: var(--color-primary-text, #543f20);
  }

  .card p {
    margin-bottom: 12px;
    line-height: 1.6;
    color: var(--color-primary-text, #543f20);
  }

  .card a {
    color: var(--color-link, #0066cc);
    text-decoration: underline;
  }

  .card a:hover {
    color: var(--color-link-hover, #003366);
  }
`;

/**
 * Standard button styles
 */
export const buttonStyles = css`
  button,
  .button {
    padding: 8px 16px;
    font-size: 12px;
    font-family: Arial, sans-serif;
    background-color: var(--color-accent-brown, #c89d5f);
    color: var(--color-white, #ffffff);
    border: 1px solid var(--color-border, #000000);
    cursor: pointer;
    font-weight: bold;
  }

  button:hover,
  .button:hover {
    background-color: var(--color-accent-brown-alt, #ad915f);
  }

  .back-button {
    padding: 8px 16px;
    font-size: 12px;
    font-family: Arial, sans-serif;
    background-color: var(--color-accent-brown, #c89d5f);
    color: var(--color-white, #ffffff);
    border: 1px solid var(--color-white, #ffffff);
    cursor: pointer;
    margin-bottom: 24px;
    display: inline-block;
  }

  .back-button:hover {
    background-color: var(--color-accent-brown-alt, #ad915f);
  }
`;

/**
 * Utility styles
 */
export const utilityStyles = css`
  .center {
    text-align: center;
  }

  .error {
    color: var(--color-error, #cc0000);
    padding: 12px;
    margin: 12px 0;
    background-color: var(--color-content-bg, #f5f0e8);
    border: 2px solid var(--color-error, #cc0000);
  }
`;
