'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function SwaggerPage() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .swagger-ui {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      
      .swagger-ui .topbar {
        background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
        padding: 20px 0;
        box-shadow: 0 2px 8px rgba(236, 72, 153, 0.2);
      }
      
      .swagger-ui .topbar .download-url-wrapper {
        display: none;
      }
      
      .swagger-ui .info {
        margin: 40px 0;
      }
      
      .swagger-ui .info .title {
        color: #1f2937;
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 10px;
      }
      
      .swagger-ui .info .title small {
        display: none;
      }
      
      .swagger-ui .info .description {
        color: #4b5563;
        font-size: 16px;
        line-height: 1.6;
      }
      
      .swagger-ui .scheme-container {
        background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
        border: 1px solid #fbcfe8;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      
      .swagger-ui .btn.authorize {
        background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
        border: none;
        color: white;
        border-radius: 6px;
        padding: 10px 20px;
        font-weight: 600;
        transition: all 0.2s;
      }
      
      .swagger-ui .btn.authorize:hover {
        background: linear-gradient(135deg, #db2777 0%, #e11d48 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
      }
      
      .swagger-ui .opblock.opblock-post {
        border-color: #ec4899;
        background: #fdf2f8;
      }
      
      .swagger-ui .opblock.opblock-post .opblock-summary {
        border-color: #ec4899;
      }
      
      .swagger-ui .opblock.opblock-post .opblock-summary-method {
        background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
      }
      
      .swagger-ui .opblock.opblock-get {
        border-color: #3b82f6;
        background: #eff6ff;
      }
      
      .swagger-ui .opblock.opblock-get .opblock-summary {
        border-color: #3b82f6;
      }
      
      .swagger-ui .opblock.opblock-get .opblock-summary-method {
        background: #3b82f6;
      }
      
      .swagger-ui .opblock.opblock-put {
        border-color: #f59e0b;
        background: #fffbeb;
      }
      
      .swagger-ui .opblock.opblock-put .opblock-summary {
        border-color: #f59e0b;
      }
      
      .swagger-ui .opblock.opblock-put .opblock-summary-method {
        background: #f59e0b;
      }
      
      .swagger-ui .opblock.opblock-delete {
        border-color: #ef4444;
        background: #fef2f2;
      }
      
      .swagger-ui .opblock.opblock-delete .opblock-summary {
        border-color: #ef4444;
      }
      
      .swagger-ui .opblock.opblock-delete .opblock-summary-method {
        background: #ef4444;
      }
      
      .swagger-ui .opblock .opblock-summary {
        border-radius: 6px;
        padding: 15px 20px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 15px;
        flex-wrap: nowrap;
      }
      
      .swagger-ui .opblock .opblock-summary:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .swagger-ui .opblock .opblock-summary-method {
        border-radius: 4px;
        font-weight: 600;
        padding: 6px 12px;
        width: 80px;
        min-width: 80px;
        max-width: 80px;
        text-align: center;
        flex-shrink: 0;
        font-size: 14px;
        display: inline-block;
        box-sizing: border-box;
      }
      
      .swagger-ui .opblock .opblock-summary-path {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        flex: 1;
        min-width: 200px;
        margin-right: 15px;
      }
      
      .swagger-ui .opblock .opblock-summary-description {
        color: #6b7280;
        font-size: 14px;
        flex: 1;
        min-width: 150px;
      }
      
      .swagger-ui .opblock .opblock-summary .view-line-link {
        margin-left: auto;
        flex-shrink: 0;
      }
      
      .swagger-ui .opblock .opblock-summary-operation-id,
      .swagger-ui .opblock .opblock-summary-path__deprecated {
        display: none;
      }
      
      .swagger-ui .btn.execute {
        background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
        border: none;
        color: white;
        border-radius: 6px;
        padding: 10px 24px;
        font-weight: 600;
        transition: all 0.2s;
      }
      
      .swagger-ui .btn.execute:hover {
        background: linear-gradient(135deg, #db2777 0%, #e11d48 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
      }
      
      .swagger-ui .response-col_status {
        font-weight: 600;
      }
      
      .swagger-ui .response-col_links {
        display: none;
      }
      
      .swagger-ui .response-col_description {
        flex: 1;
      }
      
      .swagger-ui table.responses-table th.response-col_links,
      .swagger-ui table.responses-table td.response-col_links {
        display: none;
      }
      
      .swagger-ui .model-box {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 15px;
      }
      
      .swagger-ui .model-title {
        color: #1f2937;
        font-weight: 600;
      }
      
      .swagger-ui .parameter__name {
        color: #1f2937;
        font-weight: 600;
      }
      
      .swagger-ui .parameter__type {
        color: #ec4899;
        font-weight: 500;
      }
      
      .swagger-ui .response-col_description {
        color: #4b5563;
      }
      
      .swagger-ui .scheme-container .schemes {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      
      .swagger-ui .scheme-container .schemes > label {
        color: #1f2937;
        font-weight: 600;
        margin-right: 10px;
      }
      
      .swagger-ui .scheme-container select {
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 8px 12px;
        background: white;
        color: #1f2937;
        font-size: 14px;
      }
      
      .swagger-ui .scheme-container select:focus {
        outline: none;
        border-color: #ec4899;
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
      }
      
      .swagger-ui input[type="text"],
      .swagger-ui input[type="password"],
      .swagger-ui textarea {
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 14px;
        transition: all 0.2s;
      }
      
      .swagger-ui input[type="text"]:focus,
      .swagger-ui input[type="password"]:focus,
      .swagger-ui textarea:focus {
        outline: none;
        border-color: #ec4899;
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
      }
      
      .swagger-ui .response-content-type {
        color: #6b7280;
        font-size: 12px;
      }
      
      .swagger-ui .highlight-code {
        background: #1f2937;
        color: #f9fafb;
        border-radius: 6px;
        padding: 15px;
      }
      
      .swagger-ui .opblock-body {
        background: white;
        border-radius: 6px;
        padding: 25px;
        margin-top: 10px;
      }
      
      .swagger-ui .opblock-description-wrapper {
        padding: 15px 20px;
        background: #f9fafb;
        border-radius: 6px;
        margin-bottom: 20px;
      }
      
      .swagger-ui .opblock-description {
        color: #4b5563;
        line-height: 1.6;
      }
      
      .swagger-ui .opblock-section {
        margin-bottom: 25px;
      }
      
      .swagger-ui .opblock-section-header {
        padding: 12px 20px;
        background: #f9fafb;
        border-radius: 6px;
        margin-bottom: 15px;
      }
      
      .swagger-ui .parameters-container,
      .swagger-ui .responses-wrapper {
        padding: 0 5px;
      }
      
      .swagger-ui .parameter-row {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        padding: 15px;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .swagger-ui .parameter-row:last-child {
        border-bottom: none;
      }
      
      .swagger-ui .parameter-name {
        min-width: 120px;
        font-weight: 600;
        color: #1f2937;
      }
      
      .swagger-ui .parameter-type {
        min-width: 100px;
        color: #ec4899;
        font-weight: 500;
      }
      
      .swagger-ui .parameter-description {
        flex: 1;
        color: #4b5563;
      }
      
      .swagger-ui .response {
        padding: 15px;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .swagger-ui .response:last-child {
        border-bottom: none;
      }
      
      .swagger-ui .response-col_status {
        min-width: 80px;
        font-weight: 600;
      }
      
      .swagger-ui .response-col_description {
        flex: 1;
        color: #4b5563;
      }
      
      .swagger-ui .response-col_links,
      .swagger-ui th.response-col_links,
      .swagger-ui td.response-col_links,
      .swagger-ui .response-col_links * {
        display: none !important;
      }
      
      .swagger-ui table.responses-table {
        width: 100%;
      }
      
      .swagger-ui table.responses-table th:last-child,
      .swagger-ui table.responses-table td:last-child {
        display: none;
      }
      
      .swagger-ui .btn-group {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: 20px;
      }
      
      .swagger-ui .request-body {
        margin: 20px 0;
      }
      
      .swagger-ui .body-param-content {
        padding: 15px;
        background: #f9fafb;
        border-radius: 6px;
      }
      
      body {
        background: linear-gradient(to bottom, #fdf2f8 0%, #ffffff 100%);
        min-height: 100vh;
      }
      
      .swagger-ui .wrapper {
        padding: 20px;
        max-width: 1400px;
        margin: 0 auto;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="container mx-auto py-8">
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  )
}
