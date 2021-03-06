import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { JwtHttp } from 'angular2-jwt-refresh';

import { Workflow } from '../models/playbook/workflow';
import { Playbook } from '../models/playbook/playbook';
import { AppApi } from '../models/api/appApi';
import { Device } from '../models/device';
import { User } from '../models/user';
import { Role } from '../models/role';

@Injectable()
export class PlaybookService {
	constructor(private authHttp: JwtHttp) { }

	// TODO: should maybe just return all playbooks and not just names?
	getPlaybooks(): Promise<Playbook[]> {
		return this.authHttp.get('/api/playbooks')
			.toPromise()
			.then(this.extractData)
			.then(data => data as Playbook[])
			.catch(this.handleError);
	}

	/**
	 * Renames an existing playbook.
	 * @param oldName Current playbook name to change
	 * @param newName New name for the updated playbook
	 */
	renamePlaybook(oldName: string, newName: string): Promise<void> {
		return this.authHttp.post('/api/playbooks', { name: oldName, new_name: newName })
			.toPromise()
			.then(this.extractData)
			.catch(this.handleError);
	}

	/**
	 * Duplicates and saves an existing playbook, it's workflows, actions, branches, etc. under a new name.
	 * @param oldName Name of the playbook to duplicate
	 * @param newName Name of the new copy to be saved
	 */
	duplicatePlaybook(oldName: string, newName: string): Promise<void> {
		return this.authHttp.post(`/api/playbooks/${oldName}/copy`, { playbook: newName })
			.toPromise()
			.then(this.extractData)
			.catch(this.handleError);
	}

	/**
	 * Deletes a playbook by name.
	 * @param playbookToDelete Name of playbook to be deleted.
	 */
	deletePlaybook(playbookToDelete: string): Promise<void> {
		return this.authHttp.delete(`/api/playbooks/${playbookToDelete}`)
			.toPromise()
			.then(this.extractData)
			.catch(this.handleError);
	}

	/**
	 * Renames a workflow under a given playbook.
	 * @param playbook Name of playbook the workflow exists under
	 * @param oldName Current workflow name to be changed
	 * @param newName New name for the updated workflow
	 */
	renameWorkflow(playbook: string, oldName: string, newName: string): Promise<void> {
		return this.authHttp.post(`/api/playbooks/${playbook}/workflows`, { name: oldName, new_name: newName })
			.toPromise()
			.then(this.extractData)
			.catch(this.handleError);
	}

	/**
	 * Duplicates a workflow under a given playbook, it's actions, branches, etc. under a new name.
	 * @param playbook Name of playbook the workflow exists under
	 * @param oldName Current workflow name to be duplicated
	 * @param newName Name for the new copy to be saved
	 */
	// TODO: probably don't need playbook in body, verify on server
	duplicateWorkflow(playbook: string, oldName: string, newName: string): Promise<Workflow> {
		return this.authHttp.post(`/api/playbooks/${playbook}/workflows/${oldName}/copy`, { playbook, workflow: newName })
			.toPromise()
			.then(this.extractData)
			.then(data => data as Workflow)
			.catch(this.handleError);
	}

	/**
	 * Deletes a given workflow under a given playbook.
	 * @param playbook Name of the playbook the workflow exists under
	 * @param workflowToDelete Name of the workflow to be deleted
	 */
	deleteWorkflow(playbook: string, workflowToDelete: string): Promise<void> {
		return this.authHttp.delete(`/api/playbooks/${playbook}/workflows/${workflowToDelete}`)
			.toPromise()
			.then(this.extractData)
			.catch(this.handleError);
	}

	/**
	 * Creates a new blank workflow under a given playbook.
	 * @param playbook Name of the playbook the new workflow should be added under
	 * @param workflow Name of the new workflow to be saved
	 */
	newWorkflow(playbook: string, workflow: string): Promise<Workflow> {
		return this.authHttp.put(`/api/playbooks/${playbook}/workflows`, { name: workflow })
			.toPromise()
			.then(this.extractData)
			.then(data => data as Workflow)
			.catch(this.handleError);
	}

	/**
	 * Saves the data of a given workflow specified under a given playbook.
	 * @param playbookName Name of the playbook the workflow exists under
	 * @param workflowName Name of the workflow to be saved
	 * @param workflow Data to be saved under the workflow (actions, etc.)
	 */
	saveWorkflow(playbookName: string, workflowName: string, workflow: Workflow): Promise<void> {
		return this.authHttp.post(`/api/playbooks/${playbookName}/workflows/${workflowName}/save`, workflow)
			.toPromise()
			.then(this.extractData)
			.catch(this.handleError);
	}

	/**
	 * Loads the data of a given workflow under a given playbook.
	 * @param playbook Name of playbook the workflow exists under
	 * @param workflow Name of the workflow to load
	 */
	loadWorkflow(playbook: string, workflow: string): Promise<Workflow> {
		return this.authHttp.get(`/api/playbooks/${playbook}/workflows/${workflow}`)
			.toPromise()
			.then(this.extractData)
			.then(data => data as Workflow)
			.catch(this.handleError);
	}

	/**
	 * Notifies the server to execute a given workflow under a given playbook.
	 * Note that execution results are not returned here, but on a separate stream-actions EventSource.
	 * @param playbook Name of the playbook the workflow exists under
	 * @param workflow Name of the workflow to execute
	 */
	executeWorkflow(playbook: string, workflow: string): Promise<void> {
		return this.authHttp.post(`/api/playbooks/${playbook}/workflows/${workflow}/execute`, {})
			.toPromise()
			.then(this.extractData)
			.catch(this.handleError);
	}
	
	/**
	 * Returns an array of all devices within the DB.
	 */
	getDevices(): Promise<Device[]> {
		return this.authHttp.get('/api/devices')
			.toPromise()
			.then(this.extractData)
			.then(data => data as Device[])
			.catch(this.handleError);
	}

	/**
	 * Gets all app apis from the server.
	 */
	getApis(): Promise<AppApi[]> {
		return this.authHttp.get('/api/apps/apis')
			.toPromise()
			.then(this.extractData)
			.then(data => data as AppApi[])
			.catch(this.handleError);
	}

	/**
	 * Returns an array of all users within the DB.
	 */
	getUsers(): Promise<User[]> {
		return this.authHttp.get('/api/users')
			.toPromise()
			.then(this.extractData)
			.then(data => data as User[])
			.catch(this.handleError);
	}

	/**
	 * Returns an array of all roles within the application.
	 */
	getRoles(): Promise<Role[]> {
		return this.authHttp.get('/api/roles')
			.toPromise()
			.then(this.extractData)
			.then(data => data as Role[])
			.catch(this.handleError);
	}

	private extractData(res: Response) {
		const body = res.json();
		return body || {};
	}

	private handleError(error: Response | any): Promise<any> {
		let errMsg: string;
		let err: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			err = body.error || body.detail || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			err = errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		throw new Error(err);
	}
}
