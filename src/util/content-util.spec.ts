import { Content } from 'sunbird-sdk';
import { ContentUtil } from '@app/util/content-util';

describe('ContentUtil', () => {
    describe('resolvePDFPreview()', () => {
        it('should return undefined if no itemSetPreviewUrl is set for Content', () => {
            // arrange
            const content: Partial<Content> = {
                contentData: {
                    itemSetPreviewUrl: undefined
                }
            };

            // act / assert
            expect(ContentUtil.resolvePDFPreview(content as Content)).toEqual(undefined);
        });

        it('should return network url if itemSetPreviewUrl is set for Content as network url', () => {
            // arrange
            const content: Partial<Content> = {
                contentData: {
                    itemSetPreviewUrl: 'http://some_domain.com/som_path.some_extension'
                }
            };

            // act / assert
            expect(ContentUtil.resolvePDFPreview(content as Content)).toEqual(
                expect.objectContaining({
                    url: 'http://some_domain.com/som_path.some_extension',
                    availableLocally: false
                })
            );
        });

        it('should return local url if itemSetPreviewUrl is set for Content as bundled relative path', () => {
            // arrange
            let content: Partial<Content> = {
                basePath: 'file://some_local_path/some_local_path',
                contentData: {
                    itemSetPreviewUrl: 'http://some_domain.com/some_path.some_extension'
                }
            };

            // act / assert
            expect(ContentUtil.resolvePDFPreview(content as Content)).toEqual(
                expect.objectContaining({
                    url: 'http://some_domain.com/some_path.some_extension',
                    availableLocally: false
                })
            );

            content = {
                basePath: 'file://some_local_path/some_local_path',
                contentData: {
                    itemSetPreviewUrl: '/some_path.some_extension'
                }
            };

            // act / assert
            expect(ContentUtil.resolvePDFPreview(content as Content)).toEqual(
                expect.objectContaining({
                    url: 'file://some_local_path/some_local_path/some_path.some_extension',
                    availableLocally: true
                })
            );
        });
    });

    describe('arrayEmptyStringCheck()', () => {
        it('should return true if an array contains an empty string', () => {
            // arrange
            // act / assert
            expect(ContentUtil.arrayEmptyStringCheck(['sample', ''])).toBeTruthy();
        });
    });

    describe('getAppIcon()', () => {
        it('should return app icon if network is not available and its a http url', () => {
            // arrange
            // act / assert
            expect(ContentUtil.getAppIcon('http://sample_aap_icon.png', 'sample_basepath', false)).toEqual('assets/imgs/ic_launcher.png');
        });

        it('should return basepath + app icon if app icon is not a  http url', () => {
            // arrange
            // act / assert
            expect(ContentUtil.getAppIcon('content/sample_aap_icon.png', 'sample_basepath', false)).toEqual(
                'sample_basepath/content/sample_aap_icon.png');
        });
    });

    describe('genrateUTMCData', () => {
        it('should return utm parameter for utm_campaign', () => {
            // arrange
            const value = {
                utm_source: 'https://sunbirded.org/learn/course/do_12345',
                utm_medium: 'playstore',
                utm_campaign: 'igot'
            };

            // act
            // assert
            expect(ContentUtil.genrateUTMCData(value)).toEqual([{
                id: 'igot',
                type: 'Source'
            },
            {
                id: 'https://sunbirded.org/learn/course/do_12345',
                type: 'UtmSource'
            }, {
                id: 'playstore',
                type: 'UtmMedium'
            }]);
        });

        it('should return utm parameter for utm_campaign', () => {
            // arrange
            const value = {
                utm_source: 'https://sunbirded.org/learn/course/do_12345?channel=abc',
                utm_medium: 'playstore',
            };

            // act
            // assert
            expect(ContentUtil.genrateUTMCData(value)).toEqual([{
                id: 'abc',
                type: 'Source'
            },
            {
                id: 'https://sunbirded.org/learn/course/do_12345?channel=abc',
                type: 'UtmSource'
            }, {
                id: 'playstore',
                type: 'UtmMedium'
            }]);
        });
        it('should return utm parameter for channel', () => {
            // arrange
            const value = {
                utm_source: 'https://sunbirded.org/learn/course/do_12345',
                utm_medium: 'playstore',
                channel: 'igot'
            };

            // act
            // assert
            expect(ContentUtil.genrateUTMCData(value)).toEqual([{
                id: 'igot',
                type: 'Source'
            },
            {
                id: 'https://sunbirded.org/learn/course/do_12345',
                type: 'UtmSource'
            }, {
                id: 'playstore',
                type: 'UtmMedium'
            }]);
        });
    });
});
