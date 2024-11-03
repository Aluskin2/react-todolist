describe('ToDo List App', () => {
    beforeEach(() => {
        // Zresetuj lokalne storage przed każdym testem
        localStorage.clear();
        cy.visit('http://localhost:3000'); // Upewnij się, że aplikacja działa na tym adresie
    });

    it('should add a new task', () => {
        cy.get('input[placeholder="New task"]').type('New Task');
        cy.get('button').contains('Add').click();
        cy.get('ul').should('contain', 'New Task');
    });

    it('should delete a task', () => {
        cy.get('input[placeholder="New task"]').type('Task to Delete');
        cy.get('button').contains('Add').click();

        cy.get('button').contains('Delete').click();
        cy.get('ul').should('not.contain', 'Task to Delete');
    });

    it('should persist tasks in local storage', () => {
        cy.get('input[placeholder="New task"]').type('Persistent Task');
        cy.get('button').contains('Add').click();

        // Sprawdź lokalne storage
        cy.window().then((window) => {
            const tasks = JSON.parse(window.localStorage.getItem('tasks'));
            expect(tasks).to.have.length(1);
            expect(tasks[0].text).to.eq('Persistent Task');
        });

        // Odśwież stronę
        cy.reload();
        cy.get('ul').should('contain', 'Persistent Task');
    });

    it('should check and uncheck tasks', () => {
        cy.get('input[placeholder="New task"]').type('Task to Check');
        cy.get('button').contains('Add').click();

        cy.get('input[type="checkbox"]').check();
        cy.get('input[type="checkbox"]').should('be.checked');

        cy.get('input[type="checkbox"]').uncheck();
        cy.get('input[type="checkbox"]').should('not.be.checked');
    });

    it('should filter tasks', () => {
        cy.get('input[placeholder="New task"]').type('Task 1');
        cy.get('button').contains('Add').click();

        cy.get('input[placeholder="New task"]').type('Task 2');
        cy.get('button').contains('Add').click();

        // Zaznacz 'Task 1' jako ukończony
        cy.get('input[type="checkbox"]').first().check();

        // Filtruj tylko aktywne zadania
        cy.get('input[type="radio"][value="active"]').check();
        cy.get('ul').should('not.contain', 'Task 1'); // Sprawdź, czy Task 1 nie jest widoczny
        cy.get('ul').should('contain', 'Task 2'); // Sprawdź, czy Task 2 jest widoczny

        // Filtruj tylko ukończone zadania
        cy.get('input[type="radio"][value="completed"]').check();
        cy.get('ul').should('contain', 'Task 1'); // Sprawdź, czy Task 1 jest widoczny
        cy.get('ul').should('not.contain', 'Task 2'); // Sprawdź, czy Task 2 nie jest widoczny
    });

    it('should handle asynchronous operations', () => {
        cy.get('input[placeholder="New task"]').type('Async Task');
        cy.get('button').contains('Add').click();

        // Symulacja opóźnienia
        cy.wait(1000); // Oczekuj na 1 sekundy (symulacja opóźnienia)
        cy.get('ul').should('contain', 'Async Task');
    });
});
