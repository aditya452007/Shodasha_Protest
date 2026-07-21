import { describe, it, expect } from 'vitest';
import {
  isStrictPlainText,
  sanitizeToPlainText,
  validateAndExtractHttpsLinks,
  hashContent,
} from '../src/utils/sanitizer.js';

describe('Sanitizer Utility', () => {
  it('should detect forbidden HTML and script tags', () => {
    expect(isStrictPlainText('<script>alert("xss")</script>')).toBe(false);
    expect(isStrictPlainText('<iframe src="evil.com"></iframe>')).toBe(false);
    expect(isStrictPlainText('<svg onload="alert(1)">')).toBe(false);
    expect(isStrictPlainText('javascript:void(0)')).toBe(false);
    expect(isStrictPlainText('data:text/html;base64,123')).toBe(false);
    expect(isStrictPlainText('Clean plain text update')).toBe(true);
  });

  it('should strip HTML tags completely', () => {
    const input = '<b>Protest Update:</b> DU students gather at <i>VC Office</i>';
    const clean = sanitizeToPlainText(input);
    expect(clean).toBe('Protest Update: DU students gather at VC Office');
  });

  it('should enforce HTTPS only and max 3 links', () => {
    const validText = 'Read details at https://news.org/report and https://du.ac.in/notice';
    const result = validateAndExtractHttpsLinks(validText);
    expect(result.valid).toBe(true);
    expect(result.links).toEqual(['https://news.org/report', 'https://du.ac.in/notice']);

    const httpText = 'Check http://insecure.com/report';
    const httpResult = validateAndExtractHttpsLinks(httpText);
    expect(httpResult.valid).toBe(false);
    expect(httpResult.error).toContain('Only https:// links are permitted');

    const fourLinks =
      'https://a.com https://b.com https://c.com https://d.com';
    const fourResult = validateAndExtractHttpsLinks(fourLinks);
    expect(fourResult.valid).toBe(false);
    expect(fourResult.error).toContain('Exceeded maximum link limit');
  });

  it('should produce consistent hash for content deduplication', () => {
    const text1 = 'DU Fee Hike Protest at North Campus';
    const text2 = 'du fee hike protest at north campus';
    expect(hashContent(text1)).toBe(hashContent(text2));
  });
});
