/// <reference types="cypress" />

describe('Sandbox', () => {
    it('Сценарий (один тест, сквозной)', () => {

        // Константы
        const INPUT = 'input[type="file"][accept="image/*"]';
        const AVATAR_IMG = 'img[alt="avatar"]';
        const FILE_NAME = 'avatar-icon.svg'; // лежит в cypress/fixtures/


        cy.viewport(1920, 800);

        // логин
        cy.login('boneyo5658@nrlord.com', 'Zxcvbn1029');

        // проверка, что мы на дашборде
        cy.location('pathname').should('include', '/dashboard/home');
        cy.location('pathname').should('not.include', '/sign-in');

        // перехваты ключевых запросов
        cy.intercept('GET', '**/api/users/**').as('users');
        cy.intercept('GET', '**/api/games**').as('games');
        cy.intercept('GET', '**/api/club/limits**').as('limits');
        cy.intercept('GET', '**/api/member/clubs**').as('clubs');

        // перезагрузка страницы
        cy.reload();

        // ждём первые срабатывания всех ключевых запросов и валидируем 200
        cy.wait('@users').its('response.statusCode').should('eq', 200);
        cy.wait('@games').its('response.statusCode').should('eq', 200);
        cy.wait('@limits').its('response.statusCode').should('eq', 200);
        cy.wait('@clubs').its('response.statusCode').should('eq', 200);

        // снова убеждаемся, что нас не выкинуло
        cy.location('pathname').should('include', '/dashboard/home');
        cy.location('pathname').should('not.include', '/sign-in');

        // Аватарка
        cy.get('.sc-ldQIZo.gWHpeg').find('img').click();
        cy.url().should('contain', 'dashboard/settings');

        // Редакирование профиля
        cy.get('.sc-cUbjZH.jftCXq').find('svg').click();
        cy.location('pathname').should('include', '/dashboard/settings/edit-profile');



        // Сохраняем текущий src аватарки
        cy.get(AVATAR_IMG)
            .invoke('prop', 'src')
            .then((src: string) => {
                cy.wrap(src).as('oldSrc');
            });

        // Нажимаем "Edit photo"
        cy.get('.sc-jppoqJ.llejnj').contains('Edit photo').click();

        // Перехват PUT запроса на загрузку аватарки
        cy.intercept('PUT', '**/api/users/35').as('avatarUpload');

        // Загрузка файла
        cy.get(INPUT).selectFile(`cypress/fixtures/${FILE_NAME}`, { force: true });

        // Нажимаем "Save"
        cy.get('.sc-eBZaSC.cWeJEz').contains('Save').click();

        // Ждём 2xx от бэка
        cy.wait('@avatarUpload').then((i) => {
            expect(i.response?.statusCode, i.request.url).to.be.within(200, 299);
        });

        // Проверяем, что src изменился
        const normalize = (u: string) => String(u).split('?')[0]; // на случай URL с query берём строку и обрезаем всё после вопросительного знака

        cy.get<string>('@oldSrc').then((oldSrc) => {
            cy.get(AVATAR_IMG)
                .invoke('prop', 'src')
                .then((newSrc: string) => {
                    expect(normalize(newSrc)).to.not.eq(normalize(oldSrc));
                    cy.wrap(newSrc).as('newSrc');
                });
        });

        // Перезагрузка и проверка сохранности
        cy.reload();

        cy.get<string>('@newSrc').then((newSrc) => {
            cy.get(AVATAR_IMG)
                .invoke('prop', 'src')
                .then((srcAfter: string) => {
                    expect(normalize(srcAfter)).to.eq(normalize(newSrc));
                });
        });

        // Аватарка
        cy.get('.sc-ldQIZo.gWHpeg').find('img').click();
        cy.url().should('contain', 'dashboard/settings');

        // Редакирование профиля
        cy.get('.sc-cUbjZH.jftCXq').find('svg').click();
        cy.location('pathname').should('include', '/dashboard/settings/edit-profile');

        // Редактирование аватарки
        cy.contains('p', 'Choose Avatar').click();
        cy.contains('.sc-gPxmnk.cEUFuk', '”Golden Gambler” avatar').find('button').click({ force: true });
        cy.intercept('PUT', '**/api/users/35').as('updateUser');
        cy.get('.sc-gVPvgB.ccLDDi')
            .find('div')
            .should('have.attr', 'role', 'button')
            .contains('div', "Use").click();
        cy.wait('@updateUser').its('response.statusCode').should('eq', 200);


    });

    xit('cookie 2', () => {
        // cy.window().then((win) => {
        //     const keys = Object.keys(win.localStorage);
        //     const sKeys = Object.keys(win.sessionStorage);
        //     cy.log('localStorage keys:', keys.join(', '));
        //     cy.log('sessionStorage keys:', sKeys.join(', '));

        //     console.log('localStorage:', win.localStorage);
        //     console.log('sessionStorage:', win.sessionStorage);
        // });
    });
});