import { Configuration } from '../Types/types'
import { ConfigurationModel } from './ConfigurationModel'

export class ConfigurationController {

	private configurationModel: ConfigurationModel;

    constructor(){
        this.configurationModel = new ConfigurationModel();
    }
	
	public async getConfiguration() {
		return this.configurationModel.getConfiguration()
	}

	public setConfiguration(configuration: Configuration) {
		this.configurationModel.setConfiguration(configuration)
	}

	public updateConfiguration(configuration: Configuration) {
		this.configurationModel.updateConfiguration(configuration)
	}
}